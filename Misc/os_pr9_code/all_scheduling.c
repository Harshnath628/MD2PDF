/*
 * All CPU scheduling algorithms — runs ALL at once, then prints
 * a combined comparison table.
 * Build: gcc -Wall -o all_scheduling all_scheduling.c
 * Run:   all_scheduling.exe   (Windows)  or  ./all_scheduling  (Linux)
 */
#include <limits.h>
#include <stdio.h>
#include <string.h>

#define MAX 10
#define NUM_ALGOS 6

struct Process {
    int pid;
    int arrival;
    int burst;
    int priority;
    int waiting;
    int turnaround;
    int remaining;
    int completed;
};

struct AlgoResult {
    const char *name;
    int wt[MAX];
    int tat[MAX];
    float avg_wt;
    float avg_tat;
};

static void copy_procs(
    struct Process dst[],
    const struct Process src[],
    int n)
{
    memcpy(dst, src, (size_t)n * sizeof(struct Process));
}

static void store_result(
    struct AlgoResult *r,
    const char *name,
    struct Process p[],
    int n)
{
    float sum_wt = 0.0f;
    float sum_tat = 0.0f;

    r->name = name;
    for (int i = 0; i < n; i++) {
        r->wt[i]  = p[i].waiting;
        r->tat[i] = p[i].turnaround;
        sum_wt  += (float)p[i].waiting;
        sum_tat += (float)p[i].turnaround;
    }
    r->avg_wt  = sum_wt  / (float)n;
    r->avg_tat = sum_tat / (float)n;
}

static void print_result(struct Process p[], int n, const char *name)
{
    float avg_wt = 0.0f;
    float avg_tat = 0.0f;

    printf("\n%s\nPID\tAT\tBT\tWT\tTAT\n", name);
    for (int i = 0; i < n; i++) {
        printf(
            "P%d\t%d\t%d\t%d\t%d\n",
            p[i].pid,
            p[i].arrival,
            p[i].burst,
            p[i].waiting,
            p[i].turnaround
        );
        avg_wt  += (float)p[i].waiting;
        avg_tat += (float)p[i].turnaround;
    }
    printf(
        "\nAverage WT: %.2f  |  Average TAT: %.2f\n",
        avg_wt / (float)n,
        avg_tat / (float)n
    );
}

/* ---- FCFS ---- */
static void fcfs(struct Process p[], int n)
{
    int time = 0;

    printf("\nGantt:\nprocess\tstart\tend\n");
    for (int i = 0; i < n; i++) {
        if (time < p[i].arrival)
            time = p[i].arrival;
        printf(
            "P%d\t%d\t%d\n",
            p[i].pid, time, time + p[i].burst
        );
        p[i].waiting = time - p[i].arrival;
        time += p[i].burst;
        p[i].turnaround = p[i].waiting + p[i].burst;
    }
    print_result(p, n, "FCFS");
}

/* ---- SJF Non-Preemptive ---- */
static void sjf_np(struct Process p[], int n)
{
    int completed = 0;
    int time = 0;

    for (int i = 0; i < n; i++) p[i].completed = 0;
    printf("\nGantt:\nprocess\tstart\tend\n");

    while (completed < n) {
        int idx = -1;
        int min_bt = INT_MAX;

        for (int i = 0; i < n; i++) {
            if (!p[i].completed && p[i].arrival <= time
                && p[i].burst < min_bt) {
                min_bt = p[i].burst;
                idx = i;
            }
        }
        if (idx == -1) { time++; continue; }

        printf(
            "P%d\t%d\t%d\n",
            p[idx].pid, time, time + p[idx].burst
        );
        p[idx].waiting = time - p[idx].arrival;
        time += p[idx].burst;
        p[idx].turnaround = p[idx].waiting + p[idx].burst;
        p[idx].completed = 1;
        completed++;
    }
    print_result(p, n, "SJF Non-Preemptive");
}

/* ---- SJF Preemptive (SRTF) ---- */
static void sjf_p(struct Process p[], int n)
{
    int time = 0;
    int completed = 0;
    int last_idx = -1;
    int start_time = 0;

    for (int i = 0; i < n; i++) {
        p[i].remaining = p[i].burst;
        p[i].completed = 0;
    }
    printf("\nGantt:\nprocess\tstart\tend\n");

    while (completed < n) {
        int idx = -1;
        int min_rem = INT_MAX;

        for (int i = 0; i < n; i++) {
            if (!p[i].completed && p[i].arrival <= time
                && p[i].remaining < min_rem) {
                min_rem = p[i].remaining;
                idx = i;
            }
        }
        if (idx != last_idx) {
            if (last_idx != -1)
                printf(
                    "P%d\t%d\t%d\n",
                    p[last_idx].pid, start_time, time
                );
            start_time = time;
            last_idx = idx;
        }
        if (idx == -1) { time++; continue; }

        p[idx].remaining--;
        time++;
        if (p[idx].remaining == 0) {
            p[idx].completed = 1;
            completed++;
            p[idx].turnaround = time - p[idx].arrival;
            p[idx].waiting =
                p[idx].turnaround - p[idx].burst;
        }
    }
    if (last_idx != -1)
        printf(
            "P%d\t%d\t%d\n",
            p[last_idx].pid, start_time, time
        );
    print_result(p, n, "SJF Preemptive (SRTF)");
}

/* ---- Priority Non-Preemptive ---- */
static void priority_np(struct Process p[], int n)
{
    int completed = 0;
    int time = 0;

    for (int i = 0; i < n; i++) p[i].completed = 0;
    printf("\nGantt:\nprocess\tstart\tend\n");

    while (completed < n) {
        int idx = -1;
        int min_prio = INT_MAX;

        for (int i = 0; i < n; i++) {
            if (!p[i].completed && p[i].arrival <= time
                && p[i].priority < min_prio) {
                min_prio = p[i].priority;
                idx = i;
            }
        }
        if (idx == -1) { time++; continue; }

        printf(
            "P%d\t%d\t%d\n",
            p[idx].pid, time, time + p[idx].burst
        );
        p[idx].waiting = time - p[idx].arrival;
        time += p[idx].burst;
        p[idx].turnaround = p[idx].waiting + p[idx].burst;
        p[idx].completed = 1;
        completed++;
    }
    print_result(p, n, "Priority Non-Preemptive");
}

/* ---- Priority Preemptive ---- */
static void priority_p(struct Process p[], int n)
{
    int time = 0;
    int completed = 0;
    int last_idx = -1;
    int start_time = 0;

    for (int i = 0; i < n; i++) {
        p[i].remaining = p[i].burst;
        p[i].completed = 0;
    }
    printf("\nGantt:\nprocess\tstart\tend\n");

    while (completed < n) {
        int idx = -1;
        int min_prio = INT_MAX;

        for (int i = 0; i < n; i++) {
            if (!p[i].completed && p[i].arrival <= time
                && p[i].priority < min_prio) {
                min_prio = p[i].priority;
                idx = i;
            }
        }
        if (idx != last_idx) {
            if (last_idx != -1)
                printf(
                    "P%d\t%d\t%d\n",
                    p[last_idx].pid, start_time, time
                );
            start_time = time;
            last_idx = idx;
        }
        if (idx == -1) { time++; continue; }

        p[idx].remaining--;
        time++;
        if (p[idx].remaining == 0) {
            p[idx].completed = 1;
            completed++;
            p[idx].turnaround = time - p[idx].arrival;
            p[idx].waiting =
                p[idx].turnaround - p[idx].burst;
        }
    }
    if (last_idx != -1)
        printf(
            "P%d\t%d\t%d\n",
            p[last_idx].pid, start_time, time
        );
    print_result(p, n, "Priority Preemptive");
}

/* ---- Round Robin ---- */
static void round_robin(struct Process p[], int n, int quantum)
{
    int time = 0;
    int completed = 0;

    for (int i = 0; i < n; i++) p[i].remaining = p[i].burst;
    printf("\nGantt:\nprocess\tstart\tend\n");

    while (completed < n) {
        int found = 0;

        for (int i = 0; i < n; i++) {
            if (p[i].remaining > 0 && p[i].arrival <= time) {
                found = 1;
                int exec = (p[i].remaining < quantum)
                    ? p[i].remaining
                    : quantum;
                printf(
                    "P%d\t%d\t%d\n",
                    p[i].pid, time, time + exec
                );
                p[i].remaining -= exec;
                time += exec;
                if (p[i].remaining == 0) {
                    p[i].turnaround =
                        time - p[i].arrival;
                    p[i].waiting =
                        p[i].turnaround - p[i].burst;
                    completed++;
                }
            }
        }
        if (!found) time++;
    }
    print_result(p, n, "Round Robin");
}

/* ---- Combined comparison tables ---- */
static void print_combined(
    struct AlgoResult res[],
    int n_algos,
    int n_procs)
{
    printf("\n");
    printf("==========================================");
    printf("==========================================\n");
    printf("  COMBINED COMPARISON — WAITING TIME (WT)\n");
    printf("==========================================");
    printf("==========================================\n");

    printf("Process");
    for (int a = 0; a < n_algos; a++)
        printf("\t%s", res[a].name);
    printf("\n");

    for (int i = 0; i < n_procs; i++) {
        printf("P%d", i + 1);
        for (int a = 0; a < n_algos; a++)
            printf("\t%d", res[a].wt[i]);
        printf("\n");
    }
    printf("Avg");
    for (int a = 0; a < n_algos; a++)
        printf("\t%.2f", res[a].avg_wt);
    printf("\n");

    printf("\n");
    printf("==========================================");
    printf("==========================================\n");
    printf("  COMBINED COMPARISON — TURNAROUND TIME (TAT)\n");
    printf("==========================================");
    printf("==========================================\n");

    printf("Process");
    for (int a = 0; a < n_algos; a++)
        printf("\t%s", res[a].name);
    printf("\n");

    for (int i = 0; i < n_procs; i++) {
        printf("P%d", i + 1);
        for (int a = 0; a < n_algos; a++)
            printf("\t%d", res[a].tat[i]);
        printf("\n");
    }
    printf("Avg");
    for (int a = 0; a < n_algos; a++)
        printf("\t%.2f", res[a].avg_tat);
    printf("\n");

    printf("\n");
    printf("==========================================");
    printf("==========================================\n");
    printf("  SUMMARY — AVERAGES\n");
    printf("==========================================");
    printf("==========================================\n");

    printf("Algorithm\t\tAvg WT\tAvg TAT\n");
    for (int a = 0; a < n_algos; a++)
        printf(
            "%-24s%.2f\t%.2f\n",
            res[a].name,
            res[a].avg_wt,
            res[a].avg_tat
        );
}

/* ---- Main: input once, run all, compare ---- */
int main(void)
{
    struct Process orig[MAX];
    struct Process work[MAX];
    struct AlgoResult res[NUM_ALGOS];
    int n;
    int q;

    printf("=== All Scheduling Algorithms ===\n");
    printf("Enter number of processes: ");
    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        orig[i].pid = i + 1;
        printf("P%d Arrival, Burst, Priority: ", i + 1);
        scanf(
            "%d %d %d",
            &orig[i].arrival,
            &orig[i].burst,
            &orig[i].priority
        );
    }
    printf("Enter Time Quantum (for Round Robin): ");
    scanf("%d", &q);

    printf("\n========== 1. FCFS ==========");
    copy_procs(work, orig, n);
    fcfs(work, n);
    store_result(&res[0], "FCFS", work, n);

    printf("\n========== 2. SJF-NP ==========");
    copy_procs(work, orig, n);
    sjf_np(work, n);
    store_result(&res[1], "SJF-NP", work, n);

    printf("\n========== 3. SJF-P (SRTF) ==========");
    copy_procs(work, orig, n);
    sjf_p(work, n);
    store_result(&res[2], "SJF-P", work, n);

    printf("\n========== 4. Priority-NP ==========");
    copy_procs(work, orig, n);
    priority_np(work, n);
    store_result(&res[3], "Prio-NP", work, n);

    printf("\n========== 5. Priority-P ==========");
    copy_procs(work, orig, n);
    priority_p(work, n);
    store_result(&res[4], "Prio-P", work, n);

    printf("\n========== 6. Round Robin (Q=%d) ==========", q);
    copy_procs(work, orig, n);
    round_robin(work, n, q);
    store_result(&res[5], "RR", work, n);

    print_combined(res, NUM_ALGOS, n);

    return 0;
}
