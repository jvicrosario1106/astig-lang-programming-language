Template Checklist/Rubric: This is how I grade you: Each implementation item will garner 5 points for a total of 100. 

1. Completeness of Work 

|Constructs|Constructs|Parser|Semantics|Interpreter|
|---|---|---|---|---|
|Headers/Comments (not required)|||||
|Variable Declaration|||||
|Arrays|||||
|Structures/Records|||||
|Pointers|||||
|Constant Declaration|||||
|Assignment|||||
|Math Expr|Simple||||
||Complex||||
|If Stmt|||||
|Loops|While||||
||For||||
||Repeat-Until/Do-while||||
|Boolean<br>Expr|Simple||||
||Complex/Simple Logical||||
||Multiple/Complex Logical||||
|Input Stmt|||||
|Output Stmt|||||
|Functions|Declare||||
||Call||||
||Recursion||||
|Nested Statements|||||



2. Error Messaging: 

         - a. Accuracy of Message 

         - b. Informativeness 

3. Error Recovery 

4. Robustness 

5. Flexibility and Robustness of Expressions 

   - Following the Expression Hierarchy: 

- a) simple_math: 

      - e.g.  x = id + num; 

         - i. x = id * id; 

         - ii. x = num / num; 

- b) complex_math: nested simple_math, multiple simple math + function calls + arrays + records/structures e.g.   x = func1(23,4,5) + 34/234*z32; 

- c) simple boolean: rel_op : <, >, <=, >=, ! 

      - e.g.  ( simple_math rel_op simple_math ) 

         - i. ( complex_math rel_op complex_math ) 

- d) complex_boolean: logical_op: &&, || 

      - e.g. (simple_boolean logical_op simple_boolean) 

- e) Complex_Logical: nested complex_boolean 

(complex _math rel_op complex math logical_op !(complex math) ... ) 

6. Efficiency 

7. Other Comments 

8. Heap Simulation 

## Semantic Errors 

1. Undeclared variable 

2. Type Mismatch 

3. Multiply-defined variables d

4. Constant Reassignment 

5. Cardinality/Ordinality: function parameters 

