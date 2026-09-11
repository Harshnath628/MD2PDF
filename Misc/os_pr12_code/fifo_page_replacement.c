/*
 * FIFO page replacement simulation.
 * Build: gcc -Wall -o fifo_page fifo_page_replacement.c
 */
#include <stdio.h>

#define MAX_FRAMES 16
#define MAX_REFS 128

static int in_queue(const int q[], int sz, int page)
{
    for (int i = 0; i < sz; i++)
        if (q[i] == page) return 1;
    return 0;
}

int main(void)
{
    int cap;
    int nref;
    int ref[MAX_REFS];
    int q[MAX_FRAMES];
    int sz = 0;
    int faults = 0;
    int hits = 0;

    printf("=== FIFO Page Replacement ===\n");
    printf("Number of frames: ");
    scanf("%d", &cap);
    if (cap < 1 || cap > MAX_FRAMES) {
        printf("Frames must be 1-%d.\n", MAX_FRAMES);
        return 1;
    }

    printf("Number of page references: ");
    scanf("%d", &nref);
    if (nref < 1 || nref > MAX_REFS) {
        printf("Refs must be 1-%d.\n", MAX_REFS);
        return 1;
    }

    printf("Enter %d page numbers: ", nref);
    for (int i = 0; i < nref; i++)
        scanf("%d", &ref[i]);

    printf(
        "\n%-6s %-8s %-20s %s\n",
        "Step",
        "Ref",
        "Frames (FIFO order)",
        "Result"
    );

    for (int step = 0; step < nref; step++) {
        int p = ref[step];

        if (in_queue(q, sz, p)) {
            hits++;
            printf(
                "%-6d %-8d [",
                step + 1,
                p
            );
            for (int i = 0; i < sz; i++)
                printf("%d%s", q[i], i < sz - 1 ? " " : "");
            printf("] HIT\n");
            continue;
        }

        faults++;
        if (sz < cap) {
            q[sz++] = p;
        } else {
            for (int i = 0; i < sz - 1; i++)
                q[i] = q[i + 1];
            q[sz - 1] = p;
        }
        printf(
            "%-6d %-8d [",
            step + 1,
            p
        );
        for (int i = 0; i < sz; i++)
            printf("%d%s", q[i], i < sz - 1 ? " " : "");
        printf("] FAULT\n");
    }

    printf("\nTotal references: %d\n", nref);
    printf("Page faults:      %d\n", faults);
    printf("Page hits:        %d\n", hits);
    printf(
        "Hit ratio:        %.2f%%\n",
        100.0 * (double)hits / (double)nref
    );

    return 0;
}
