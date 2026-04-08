/*
 * Non-preemptive Shortest Job First (SJF).
 * Build: gcc -Wall -o sjf_nonpreemptive sjf_nonpreemptive.c
 */
#include <limits.h>
#include <stdio.h>

#define MAX 10

struct Process {
    int pid;
    int arrival;
    int burst;
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
        p[i].completed = 0;
    }
}

static void calculate_sjf_non_preemptive(struct Process p[], int n)
{
    int completed = 0;
    int time = 0;

    printf("\nOrder of Execution:\nprocess_name\tstart\tend\n");

    while (completed < n) {
        int idx = -1;
        int min_burst = INT_MAX;

        for (int i = 0; i < n; i++) {
            if (!p[i].completed && p[i].arrival <= time
                && p[i].burst < min_burst) {
                min_burst = p[i].burst;
                idx = i;
            }
        }

        if (idx == -1) {
            time++;
            continue;
        }

        printf(
            "P%d\t\t%d\t%d\n",
            p[idx].pid,
            time,
            time + p[idx].burst
        );

        p[idx].waiting = time - p[idx].arrival;
        if (p[idx].waiting < 0) {
            p[idx].waiting = 0;
        }
        time += p[idx].burst;
        p[idx].turnaround = p[idx].waiting + p[idx].burst;
        p[idx].completed = 1;
        completed++;
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

    printf("Non-Preemptive SJF\nEnter number of processes: ");
    scanf("%d", &n);
    input_processes(p, n);
    calculate_sjf_non_preemptive(p, n);
    print_table(p, n);
    return 0;
}
