/*
 * LRU (Least Recently Used) page replacement simulation.
 * Frames kept in order: index 0 = LRU, last = MRU.
 * Build: gcc -Wall -o lru_page lru_page_replacement.c
 */
#include <stdio.h>

#define MAX_FRAMES 16
#define MAX_REFS 256

static int find_idx(const int f[], int c, int page)
{
    for (int i = 0; i < c; i++)
        if (f[i] == page) return i;
    return -1;
}

static void print_frames(const int f[], int c)
{
    printf("[");
    for (int i = 0; i < c; i++)
        printf("%d%s", f[i], i < c - 1 ? " " : "");
    printf("]");
}

int main(void)
{
    int cap;
    int nref;
    int ref[MAX_REFS];
    int f[MAX_FRAMES];
    int count = 0;
    int faults = 0;
    int hits = 0;

    printf("=== LRU Page Replacement ===\n");
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
        "\n%-6s %-8s %-22s %s\n",
        "Step",
        "Ref",
        "Frames LRU to MRU",
        "Result"
    );

    for (int step = 0; step < nref; step++) {
        int p = ref[step];
        int i = find_idx(f, count, p);

        if (i >= 0) {
            hits++;
            for (int k = i; k < count - 1; k++)
                f[k] = f[k + 1];
            f[count - 1] = p;
            printf("%-6d %-8d ", step + 1, p);
            print_frames(f, count);
            printf(" HIT\n");
            continue;
        }

        faults++;
        if (count < cap) {
            f[count++] = p;
        } else {
            for (int k = 0; k < count - 1; k++)
                f[k] = f[k + 1];
            f[count - 1] = p;
        }
        printf("%-6d %-8d ", step + 1, p);
        print_frames(f, count);
        printf(" FAULT\n");
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
