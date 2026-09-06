menu/burger.py

def show_burger():
    print("🍔 Burger: Beef patty, cheese, lettuce, tomato - $5.99")

2. menu/pizza.py
def show_pizza():
    print("🍕 Pizza: Pepperoni, cheese, tomato sauce - $8.99")

3. menu/*init*.py



4. main.py - THE MAIN PROGRAM

from menu.burger import show_burger
from menu.pizza import show_pizza

print("=== WELCOME TO FOOD SHOP ===")

while True:
    print("\n--- MENU ---")
    print("1. Burger")
    print("2. Pizza")
    print("3. Exit")
    
    choice = input("Enter your choice: ")

    if choice == "1":
        show_burger()
    elif choice == "2":
        show_pizza()
    elif choice == "3":
        print("Thank you! Come again.")
        break
    else:
        print("404: Item not found")
