/*
 * Preemptive SJF — Shortest Remaining Time First (SRTF).
 * Build: gcc -Wall -o sjf_srtf sjf_srtf.c
 */
#include <limits.h>
#include <stdio.h>

#define MAX 10

struct Process {
    int pid;
    int arrival;
    int burst;
    int remaining;
    int waiting;
    int turnaround;
    int completed;
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
        p[i].completed = 0;
    }
}

static void calculate_srtf(struct Process p[], int n)
{
    int completed = 0;
    int time = 0;
    int last_idx = -1;
    int start_time = 0;

    printf("\nOrder of Execution:\nprocess_name\tstart\tend\n");

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
            if (last_idx != -1) {
                printf(
                    "P%d\t\t%d\t%d\n",
                    p[last_idx].pid,
                    start_time,
                    time
                );
            }
            start_time = time;
            last_idx = idx;
        }

        if (idx == -1) {
            time++;
            continue;
        }

        p[idx].remaining--;
        time++;

        if (p[idx].remaining == 0) {
            p[idx].completed = 1;
            completed++;
            p[idx].turnaround = time - p[idx].arrival;
            p[idx].waiting = p[idx].turnaround - p[idx].burst;
        }
    }

    if (last_idx != -1) {
        printf(
            "P%d\t\t%d\t%d\n",
            p[last_idx].pid,
            start_time,
            time
        );
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

    printf("Preemptive SJF (SRTF)\nEnter number of processes: ");
    scanf("%d", &n);
    input_processes(p, n);
    calculate_srtf(p, n);
    print_table(p, n);
    return 0;
}
