#include <stdio.h>
#define V 4
#define I 999

void printarr(int arr[][V]);

void fw(int graph[][V]) {
  int arr[V][V], i, j, k;

  for (i = 0; i < V; i++)
    for (j = 0; j < V; j++)
      arr[i][j] = graph[i][j];

  
    for (i = 0; i < V; i++) {
      for (j = 0; j < V; j++) {
          for (k = 0; k < V; k++) {
        if (arr[i][k] + arr[k][j] < arr[i][j])
          arr[i][j] = arr[i][k] + arr[k][j];
      }
    }
  }
  printarr(arr);
}

void printarr(int arr[][V]) {
  for (int i = 0; i < V; i++) {
    for (int j = 0; j < V; j++) {
      if (arr[i][j] == I)
        printf("%4s", "I");
      else
        printf("%4d", arr[i][j]);
    }
    printf("\n");
  }
}

int main() {
  int graph[V][V] = {{0, 3, I, 5},
             {2, 0, I, 4},
             {I, 1, 0, I},
             {I, I, 2, 0}};
  fw(graph);
}