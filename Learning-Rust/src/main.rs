use std::{cmp::Ordering, io};
use rand::Rng;

// main function
fn main() {  
    println!("Hello, world!");

    // guess_number();

    variable();
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
