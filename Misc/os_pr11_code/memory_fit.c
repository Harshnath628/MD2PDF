/*
 * Dynamic partition allocation: First Fit, Best Fit, Worst Fit.
 * Build: gcc -Wall -o memory_fit memory_fit.c
 */
#include <limits.h>
#include <stdio.h>
#include <string.h>

#define MAX_BLOCKS 32
#define MAX_REQS 32

static void remove_block(int b[], int *count, int idx)
{
    for (int k = idx; k < *count - 1; k++)
        b[k] = b[k + 1];
    (*count)--;
}

static void print_blocks(const int b[], int count)
{
    printf("  Free blocks:");
    for (int i = 0; i < count; i++)
        printf(" %d", b[i]);
    printf("\n");
}

/*
 * mode: 0 = first fit, 1 = best fit, 2 = worst fit
 * Returns 1 if all requests satisfied, else 0.
 */
static int simulate(
    const char *title,
    int mode,
    const int *initial,
    int nblk,
    const int *req,
    int nreq)
{
    int b[MAX_BLOCKS];
    int count = nblk;

    memcpy(b, initial, (size_t)nblk * sizeof(int));

    printf("\n--- %s ---\n", title);
    print_blocks(b, count);

    for (int r = 0; r < nreq; r++) {
        int need = req[r];
        int idx = -1;

        if (mode == 0) {
            for (int i = 0; i < count; i++) {
                if (b[i] >= need) {
                    idx = i;
                    break;
                }
            }
        } else if (mode == 1) {
            int best = INT_MAX;
            for (int i = 0; i < count; i++) {
                if (b[i] >= need && b[i] < best) {
                    best = b[i];
                    idx = i;
                }
            }
        } else {
            int worst = -1;
            for (int i = 0; i < count; i++) {
                if (b[i] >= need && b[i] > worst) {
                    worst = b[i];
                    idx = i;
                }
            }
        }

        if (idx < 0) {
            printf(
                "Request %d KB: NO hole large enough.\n",
                need
            );
            print_blocks(b, count);
            return 0;
        }

        printf(
            "Request %d KB: use block[%d] size %d -> leftover %d\n",
            need,
            idx,
            b[idx],
            b[idx] - need
        );
        b[idx] -= need;
        if (b[idx] == 0)
            remove_block(b, &count, idx);
        print_blocks(b, count);
    }
    return 1;
}

int main(void)
{
    int blocks[MAX_BLOCKS];
    int reqs[MAX_REQS];
    int nblk;
    int nreq;

    printf("=== First / Best / Worst Fit ===\n");
    printf("Number of free blocks: ");
    scanf("%d", &nblk);
    printf("Enter %d block sizes (KB): ", nblk);
    for (int i = 0; i < nblk; i++)
        scanf("%d", &blocks[i]);

    printf("Number of allocation requests: ");
    scanf("%d", &nreq);
    printf("Enter %d request sizes (KB): ", nreq);
    for (int i = 0; i < nreq; i++)
        scanf("%d", &reqs[i]);

    int init[MAX_BLOCKS];
    memcpy(init, blocks, (size_t)nblk * sizeof(int));

    simulate("First Fit", 0, init, nblk, reqs, nreq);
    simulate("Best Fit", 1, init, nblk, reqs, nreq);
    simulate("Worst Fit", 2, init, nblk, reqs, nreq);

    return 0;
}
