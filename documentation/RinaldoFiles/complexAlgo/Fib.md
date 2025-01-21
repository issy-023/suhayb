# Fibonacci Algorithm

### What is Fibonacci?

Fibonacci is a series of numbers that starts with 0 and 1. Each following number is calculated by adding the two
previous numbers together. It looks like this: <br>
<br>
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, ..... <br>

* The 4rd number is: <b>1 + 1 = 2</b> <br>
* The 5rd number is: <b>1 + 2 = 3</b> <br>
* The 6rd number is: <b>2 + 3 = 5</b> <br>
  And so on..... <br>

This sequence was made famous by an Italian mathematician named Fibonacci. He used it to solve a problem about rabbit
populations.
1. A pair of rabbits (one male and one female) is born, and they can start producing offspring/kids every month.
2. Each month, starting from their birth, they produce new offspring. The same applies to their offspring once they reach maturity (a month).
3. The rabbits never die and continue producing offspring indefinitely. <br>
   ![fibrab.png](../img/fibrab.png) <br>
   Now, this sequence can also be used in programming.

### Why is The Fibonacci Sequence Useful In ICT?

De sequence is used in the ICT because it is a relatively easy algorithm/pattern that helps us understand how small steps can solve big problems,
building fast search methods and in advanced structures, like apps and software that handle large amounts of data.

### How Does a Fibonacci Algorithm Work in Programming?

<b>Using recursion (Easy Method)</b>

A computer can calculate Fibonacci numbers quickly using a simple program.
If you call fibonacci(6), the computer calculates:

<b>F(6)=F(5)+F(4), <br>
F(5)=F(4)+F(3), <br>
And so on, until it reaches F(0) and F(1).</b>

This method works and is really easy, but it can be slow with large numbers because the computer repeats the same calculation
many times.
<br>
<br>
<b>First example:</b>
```java
public int fibonacci(int n) {
    if (n <= 1) return n;  // Base case: if n is 0 or 1, return n
    return fibonacci(n - 1) + fibonacci(n - 2);  // Add the two previous numbers
}
```
<b>Using dynamic programming (Harder but Better Method)</b>

Instead of calculating everything all over again, the computer can store results that have been already found.
This is called 'dynamic programming'.<br>

Explanation of what's happening: <br>
The first and second numbers in the Fibonacci sequence are already defined: fib[0] = 0 and fib[1] = 1. After that, a simple
for loop is used to calculate the rest of the sequence.
Inside the for loop, the program takes the last number (fib[i - 1]) and the second-to-last number (fib[i - 2]) from the
array. These two numbers are added together to calculate the next number in the sequence, which is then stored in the array at fib[i].

When to use:<br>
In Search Algorithms
The Fibonacci sequence is used to search in large lists, such as in an app with thousands of products. It helps divide
the list into smaller parts to find the right item quickly.
<br>

<b>Second example:</b>
```java
public int fibonacci(int n) {
    if (n <= 1) return n;
    int[] fib = new int[n + 1];
    fib[0] = 0;
    fib[1] = 1;
    for (int i = 2; i <= n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];  // Add the previous two numbers and save the result
    }
    return fib[n];
}
```

### Comparison: Fibonacci Search vs. Binary Search
Both Fibonacci search and binary search are used to find items in sorted lists, but they work differently. Binary search
splits the list into two equal parts, while Fibonacci search uses Fibonacci numbers to decide the split. Binary search
is easier to understand and works well in most cases. Fibonacci search is useful when accessing certain parts of the list
takes longer, like on hard drives. Both are fast, with a time complexity of O(log n). Binary search is great for
general use, but Fibonacci search is better for uneven or slow data access.

### Conclusion
The Fibonacci sequence is a simple pattern with big uses. It starts with 0 and 1, and each number is the sum of the two
before it. This sequence is important in programming for mostly dynamic programming and search algorithms like Fibonacci
search. It’s even found in security systems. Fibonacci helps solve problems by breaking them into smaller steps, making
it useful in many areas like data structures. Its simplicity show how small ideas can lead to solutions with big numbers.

## Bibliography

1. Emory University. (n.d.). Fibonacci rabbits. Retrieved December 11, 2024, from https://math.oxford.emory.edu/site/math125/fibonacciRabbits/
2. GeeksforGeeks. (n.d.). Real-life applications of the Fibonacci sequence. Retrieved December 11, 2024, from https://www.geeksforgeeks.org/real-life-applications-of-fibonacci-sequence/
3. GeeksforGeeks. (n.d.). Fibonacci search. Retrieved December 11, 2024, from https://www.geeksforgeeks.org/fibonacci-search/
4. GeeksforGeeks. (n.d.). Binary search. Retrieved December 11, 2024, from https://www.geeksforgeeks.org/binary-search/
5. Coding with John. (n.d.). Fibonacci series in Java with recursion - Full tutorial (FAST algorithm). YouTube. Retrieved December 11, 2024, from https://www.youtube.com/watch?v=cum3OrpURzc
6. Vi Hart. (2011, December 22). Doodling in math: Spirals, Fibonacci, and being a plant [1 of 3]. YouTube. Retrieved November 26, 2024, from https://www.youtube.com/watch?v=ahXIMUkSXX0
7. Vi Hart. (2012, January 9). Doodling in math class: Spirals, Fibonacci, and being a plant [2 of 3]. YouTube. Retrieved November 26, 2024, from https://www.youtube.com/watch?v=ahXIMUkSXX0
8. Vi Hart. (2012, January 21). Doodling in math: Spirals, Fibonacci, and being a plant [3 of 3]. YouTube. Retrieved November 26, 2024, from https://www.youtube.com/watch?v=ahXIMUkSXX0