#include <stdio.h>

int max(int a, int b){return (a > b) ? a : b;}

int ks(int Wt, int wt[], int profit[], int n)
{
  int i, w;
  int arr[n + 1][Wt + 1];

  for (i = 0; i <= n; i++)
  {
    for (w = 0; w <= Wt; w++)
    {
      if (i == 0 || w == 0)
        arr[i][w] = 0;
      else if (wt[i - 1] <= w)
        arr[i][w] = max(profit[i - 1]+ arr[i - 1][w - wt[i - 1]],arr[i - 1][w]);
      else
        arr[i][w] = arr[i - 1][w];
    }
  }

  return arr[n][Wt];
}

int main()
{
  int profit[100] = { 17, 50, 10 };
  int wt[100] = { 30, 15, 30 };
  int w = 45,n=3;
  printf("Enter value of n : ");
  scanf("%d",&n);
  printf("Enter profit vals\n");
  for(int i=0;i<n;i++){
      scanf("%d",&profit[i]);
  }
  printf("Enter weight vals\n");
  for(int i=0;i<n;i++){
      scanf("%d",&wt[i]);
  }
  printf("Enter max weight : ");
  scanf("%d",&w);
  printf("\n%d\n", ks(w, wt, profit, n));
  return 0;
}
