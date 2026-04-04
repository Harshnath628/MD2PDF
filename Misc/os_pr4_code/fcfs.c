/*
 * Practical 5 — FCFS CPU scheduling (standard + custom order).
 * Build: gcc -Wall -o fcfs fcfs.c
 * Run:   fcfs.exe   or   ./fcfs
 * Works on Windows (MinGW), Linux, and WSL (standard C only).
 */
#include <stdio.h>
#include <stdlib.h>

#define MAX_PROCESS 10

struct Process {
    int pid;
    int arrival_time;
    int burst_time;
    int waiting_time;
    int turnaround_time;
    int completion_time;
};

static int cmp_arrival(const void *a, const void *b)
{
    const struct Process *x = a;
    const struct Process *y = b;

    if (x->arrival_time != y->arrival_time) {
        return x->arrival_time - y->arrival_time;
    }
    return x->pid - y->pid;
}

static void calculate_times(struct Process output_sequence[], int n)
{
    int current_time = 0;
    float total_wt = 0.0f;
    float total_tat = 0.0f;
    int i;

    printf("\n\n--- GANTT CHART ---\n");
    printf("Time: %d", current_time);

    for (i = 0; i < n; i++) {
        if (current_time < output_sequence[i].arrival_time) {
            current_time = output_sequence[i].arrival_time;
        }
        output_sequence[i].waiting_time =
            current_time - output_sequence[i].arrival_time;
        if (output_sequence[i].waiting_time < 0) {
            output_sequence[i].waiting_time = 0;
        }
        current_time += output_sequence[i].burst_time;
        output_sequence[i].turnaround_time =
            output_sequence[i].burst_time + output_sequence[i].waiting_time;
        output_sequence[i].completion_time = current_time;
        total_wt += (float)output_sequence[i].waiting_time;
        total_tat += (float)output_sequence[i].turnaround_time;
        printf(
            " -> [P%d] -> %d",
            output_sequence[i].pid,
            current_time
        );
    }

    printf("\n-------------------\n");
    printf("\nProcess\t AT\t BT\t WT\t TAT\n");
    for (i = 0; i < n; i++) {
        printf(
            "P%d\t %d\t %d\t %d\t %d\n",
            output_sequence[i].pid,
            output_sequence[i].arrival_time,
            output_sequence[i].burst_time,
            output_sequence[i].waiting_time,
            output_sequence[i].turnaround_time
        );
    }
    printf("\nAverage Waiting Time: %.2f", total_wt / (float)n);
    printf("\nAverage Turnaround Time: %.2f\n", total_tat / (float)n);
}

int main(void)
{
    struct Process p[MAX_PROCESS];
    struct Process sequence[MAX_PROCESS];
    int n;
    int choice;
    int i;
    int j;

    printf("Practical 5: FCFS Implementation\n");
    printf("Enter number of processes: ");
    if (scanf("%d", &n) != 1 || n < 1 || n > MAX_PROCESS) {
        printf("Invalid n (use 1-%d).\n", MAX_PROCESS);
        return 1;
    }

    for (i = 0; i < n; i++) {
        p[i].pid = i + 1;
        printf("\nProcess P%d:\n", i + 1);
        printf(" Enter Arrival Time: ");
        if (scanf("%d", &p[i].arrival_time) != 1) {
            return 1;
        }
        printf(" Enter CPU Burst Time: ");
        if (scanf("%d", &p[i].burst_time) != 1) {
            return 1;
        }
    }

    while (1) {
        printf("\n\n--- MENU ---\n");
        printf("1. Standard FCFS (sort by arrival time)\n");
        printf("2. Custom sequence\n");
        printf("3. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) {
            break;
        }
        if (choice == 3) {
            break;
        }
        if (choice == 1) {
            for (i = 0; i < n; i++) {
                sequence[i] = p[i];
            }
            qsort(sequence, (size_t)n, sizeof sequence[0], cmp_arrival);
            calculate_times(sequence, n);
        } else if (choice == 2) {
            printf(
                "\nEnter the sequence of Process IDs "
                "(e.g. 2 1 3 for P2, P1, P3):\n"
            );
            for (i = 0; i < n; i++) {
                int pid_in;

                printf("Position %d: P", i + 1);
                if (scanf("%d", &pid_in) != 1) {
                    return 1;
                }
                for (j = 0; j < n; j++) {
                    if (p[j].pid == pid_in) {
                        sequence[i] = p[j];
                        break;
                    }
                }
            }
            calculate_times(sequence, n);
        } else {
            printf("Invalid choice.\n");
        }
    }
    return 0;
}
