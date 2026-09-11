/*
 * Optimal (MIN) page replacement — needs full reference string.
 * Evict the resident page whose *next* use is farthest in the future
 * (or never used again).
 * Build: gcc -Wall -o optimal_page optimal_page_replacement.c
 */
#include <stdio.h>

#define MAX_FRAMES 16
#define MAX_REFS 256
#define INF (MAX_REFS + 999)

static int next_use(
    const int *ref,
    int nref,
    int after_step,
    int page)
{
    for (int j = after_step + 1; j < nref; j++)
        if (ref[j] == page) return j;
    return INF;
}

static int in_frames(
    const int *f,
    int c,
    int page)
{
    for (int i = 0; i < c; i++)
        if (f[i] == page) return 1;
    return 0;
}

static int pick_victim(
    const int *ref,
    int nref,
    int step,
    const int *f,
    int count)
{
    int best_i = 0;
    int best_nu = -1;
    for (int i = 0; i < count; i++) {
        int nu = next_use(ref, nref, step, f[i]);
        if (nu > best_nu) {
            best_nu = nu;
            best_i = i;
        }
    }
    return best_i;
}

static void print_frames(const int *f, int c)
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

    printf("=== Optimal Page Replacement ===\n");
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
        "\n%-6s %-8s %-18s %s\n",
        "Step",
        "Ref",
        "Frames",
        "Result"
    );

    for (int step = 0; step < nref; step++) {
        int p = ref[step];

        if (in_frames(f, count, p)) {
            hits++;
            printf("%-6d %-8d ", step + 1, p);
            print_frames(f, count);
            printf(" HIT\n");
            continue;
        }

        faults++;
        if (count < cap) {
            f[count++] = p;
        } else {
            int vi = pick_victim(ref, nref, step, f, count);
            f[vi] = p;
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
