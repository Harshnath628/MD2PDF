/*
 * Round Robin CPU scheduling (same sweep order as typical lab handout).
 * Build: gcc -Wall -o round_robin round_robin.c
 */
#include <stdio.h>

#define MAX 10

struct Process {
    int pid;
    int arrival;
    int burst;
    int remaining;
    int waiting;
    int turnaround;
};

static void input_processes(struct Process p[], int n)
{
    for (int i = 0; i < n; i++) {
        p[i].pid = i + 1;
        printf("P%d Arrival: ", i + 1);
        scanf("%d", &p[i].arrival);
        printf("P%d Burst: ", i + 1);
        scanf("%d", &p[i].burst);
        p[i].remaining = p[i].burst;
    }
}

static void calculate_round_robin(struct Process p[], int n, int quantum)
{
    int time = 0;
    int completed = 0;

    printf("\nOrder of Execution:\nprocess_name\tstart\tend\n");

    while (completed < n) {
        int found = 0;

        for (int i = 0; i < n; i++) {
            if (p[i].remaining > 0 && p[i].arrival <= time) {
                found = 1;
                int exec = (p[i].remaining < quantum)
                    ? p[i].remaining
                    : quantum;
                printf(
                    "P%d\t\t%d\t%d\n",
                    p[i].pid,
                    time,
                    time + exec
                );
                p[i].remaining -= exec;
                time += exec;
                if (p[i].remaining == 0) {
                    p[i].turnaround = time - p[i].arrival;
                    p[i].waiting = p[i].turnaround - p[i].burst;
                    completed++;
                }
            }
        }

        if (!found) {
            time++;
        }
    }
}

static void print_table(struct Process p[], int n)
{
    float avg_wt = 0.0f;
    float avg_tat = 0.0f;

    printf("\nPID\tAT\tBT\tWT\tTAT\n");
    for (int i = 0; i < n; i++) {
        printf(
            "P%d\t%d\t%d\t%d\t%d\n",
            p[i].pid,
            p[i].arrival,
            p[i].burst,
            p[i].waiting,
            p[i].turnaround
        );
        avg_wt += (float)p[i].waiting;
        avg_tat += (float)p[i].turnaround;
    }
    printf("\nAverage Waiting Time: %.2f", avg_wt / (float)n);
    printf("\nAverage Turnaround Time: %.2f\n", avg_tat / (float)n);
}

int main(void)
{
    struct Process p[MAX];
    int n;
    int q;

    printf("Round Robin\nEnter number of processes: ");
    scanf("%d", &n);
    input_processes(p, n);
    printf("Enter Time Quantum: ");
    scanf("%d", &q);
    calculate_round_robin(p, n, q);
    print_table(p, n);
    return 0;
}
