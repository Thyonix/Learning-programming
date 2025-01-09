use std::{cmp::Ordering, io};
use rand::Rng;

// main function
fn main() {  
    println!("Hello, world!");

    // guess_number();

    // variable();
    
    // data_type();

    
}

// guess number game
fn guess_number() {
    // Generate random numbers
    let guess = rand::thread_rng().gen_range(1..=100);

    loop {
        println!("Please input a number!");

        let mut number = String::new();

        // receive
        io::stdin()
        .read_line(& mut number)
        .expect("Failed to read line!");

        // format
        let number: u32 = match number.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Please confirm that it is a number!");
                continue;
            }
        };

        // compare
        match number.cmp(&guess) {
            Ordering::Greater => println!("Too big!"),
            Ordering::Less => println!("Too small!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}


// variable declaration and initialization
fn variable() {
    // variable declaration and initialization
    let mut x = 5; 
    x += 1;
    println!("variable x: {}", x);

    // constant declaration and initialization
    const THREAD_POOL_SIZE: u32 = 4;
    println!("const THREAD_POOL_SIZE: {}", THREAD_POOL_SIZE);
    
    // shadowing
    let var = "hello world";
    println!("var x: {}", var);
    {
        let var = "hello";
        println!("var x: {}", var);
    }
    let var = var.len();
    println!("var x: {}", var)
}

// data type examples
fn data_type() {
    // scalar
    let x: u32 = 5;
    let y: f64 = 3.14;
    let z: char = '哈';
    let b: bool = true;
    // tuple
    let tuple: (i32, f64, char) = (5, 3.14, '哈');
    let (a, b, c) = tuple;
    let a = tuple.0;
    let b = tuple.1;
    let c = tuple.2;
    // array
    let arr1 = [1, 2, 3, 4, 5];
    let arr2: [u32; 5] = [1, 2, 3, 4, 5];
    let arr3 = [3;5];
    let arr_var = arr1[0];
}
