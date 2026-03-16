Feature: FashionHub Products Page

  As a shopper
  I want to browse the product catalogue
  So that I can find items to buy

  Background:
    Given I am on the Products page

  Scenario: Smoke — Products page loads with correct title
    Then the page title contains "Products"

  Scenario: At least one product card is displayed
    Then at least one product card is visible

  Scenario: Product cards show a name and a price
    Then each visible product card has a name
    And each visible product card has a price

  Scenario: Product prices are formatted as currency
    Then all product prices match the currency format "$X.XX"

  Scenario: Adding a product updates the cart
    When I add the first product to the cart
    Then the cart reflects the added item
