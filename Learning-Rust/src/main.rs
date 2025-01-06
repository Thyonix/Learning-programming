use std::{cmp::Ordering, io};
use rand::Rng;

// main function
fn main() {  
    println!("Hello, world!");

    guess_number();
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
