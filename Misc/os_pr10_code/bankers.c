/*
 * Banker's Algorithm — deadlock avoidance.
 * Build: gcc -Wall -o bankers bankers.c
 * Run:   bankers.exe  (Windows)  or  ./bankers  (Linux/WSL)
 *
 * Input:
 *   n  = number of processes
 *   m  = number of resource types
 *   Allocation matrix  (n x m)
 *   Maximum matrix     (n x m)
 *   Available vector   (m)
 *
 * Output:
 *   Need matrix
 *   Whether the system is in a safe state
 *   If safe: the safe sequence
 *   Resource-request simulation (optional)
 */
#include <stdio.h>

#define MAX_P 10
#define MAX_R 10

static int n, m;
static int alloc[MAX_P][MAX_R];
static int maxm[MAX_P][MAX_R];
static int need[MAX_P][MAX_R];
static int avail[MAX_R];

static void read_input(void)
{
    printf("Number of processes: ");
    scanf("%d", &n);
    printf("Number of resource types: ");
    scanf("%d", &m);

    printf("Allocation matrix (%d x %d):\n", n, m);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            scanf("%d", &alloc[i][j]);

    printf("Maximum matrix (%d x %d):\n", n, m);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            scanf("%d", &maxm[i][j]);

    printf("Available vector (%d): ", m);
    for (int j = 0; j < m; j++)
        scanf("%d", &avail[j]);
}

static void calc_need(void)
{
    printf("\nNeed matrix (Max - Alloc):\n");
    for (int i = 0; i < n; i++) {
        printf("P%d:", i);
        for (int j = 0; j < m; j++) {
            need[i][j] = maxm[i][j] - alloc[i][j];
            printf(" %d", need[i][j]);
        }
        printf("\n");
    }
}

static int find_safe_sequence(int seq[])
{
    int work[MAX_R];
    int finish[MAX_P] = {0};
    int count = 0;

    for (int j = 0; j < m; j++)
        work[j] = avail[j];

    while (count < n) {
        int found = 0;
        for (int i = 0; i < n; i++) {
            if (finish[i]) continue;

            int ok = 1;
            for (int j = 0; j < m; j++) {
                if (need[i][j] > work[j]) {
                    ok = 0;
                    break;
                }
            }
            if (!ok) continue;

            for (int j = 0; j < m; j++)
                work[j] += alloc[i][j];
            finish[i] = 1;
            seq[count++] = i;
            found = 1;
        }
        if (!found) return 0;
    }
    return 1;
}

static void try_request(void)
{
    int pid;
    int req[MAX_R];

    printf("\n--- Resource Request Simulation ---\n");
    printf("Process number (0-%d, or -1 to skip): ", n - 1);
    scanf("%d", &pid);
    if (pid < 0 || pid >= n) return;

    printf("Request vector (%d): ", m);
    for (int j = 0; j < m; j++)
        scanf("%d", &req[j]);

    for (int j = 0; j < m; j++) {
        if (req[j] > need[pid][j]) {
            printf("Error: request exceeds Need for P%d.\n", pid);
            return;
        }
    }
    for (int j = 0; j < m; j++) {
        if (req[j] > avail[j]) {
            printf("P%d must wait: not enough available.\n", pid);
            return;
        }
    }

    for (int j = 0; j < m; j++) {
        avail[j]        -= req[j];
        alloc[pid][j]   += req[j];
        need[pid][j]    -= req[j];
    }

    int seq[MAX_P];
    if (find_safe_sequence(seq)) {
        printf("Request can be granted. Safe sequence: ");
        for (int i = 0; i < n; i++)
            printf("P%d%s", seq[i], i < n - 1 ? " -> " : "");
        printf("\n");
    } else {
        printf("Request denied: would lead to unsafe state.\n");
        for (int j = 0; j < m; j++) {
            avail[j]        += req[j];
            alloc[pid][j]   -= req[j];
            need[pid][j]    += req[j];
        }
    }
}

int main(void)
{
    int seq[MAX_P];

    printf("=== Banker's Algorithm ===\n");
    read_input();
    calc_need();

    printf("\n--- Safety Check ---\n");
    if (find_safe_sequence(seq)) {
        printf("System is in a SAFE state.\n");
        printf("Safe sequence: ");
        for (int i = 0; i < n; i++)
            printf("P%d%s", seq[i], i < n - 1 ? " -> " : "");
        printf("\n");
    } else {
        printf("System is NOT safe (deadlock possible).\n");
    }

    try_request();

    return 0;
}
