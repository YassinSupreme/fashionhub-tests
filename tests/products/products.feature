Feature: FashionHub Products Page

  As a shopper
  I want to browse the product catalogue
  So that I can find items to buy

  Background:
    Given I am on the Products page

  @smoke
  Scenario: Smoke — Products page loads with correct title
    Then the page title contains "Products"

  @smoke
  Scenario: At least one product card is displayed
    Then at least one product card is visible

  Scenario: Product cards show a name and a price
    Then each visible product card has a name
    And each visible product card has a price

  @regression
  Scenario Outline: Each product price is formatted as currency
    Then the price of product "<product>" matches the currency format

    Examples:
      | product      |
      | Peacock Coat |
      | Casual Coat  |
      | Puffer Jacket|

  @regression
  Scenario: Adding a product updates the cart
    When I add the first product to the cart
    Then the cart reflects the added item
