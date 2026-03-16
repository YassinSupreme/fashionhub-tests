Feature: FashionHub Shopping Cart

  As a shopper
  I want to manage my shopping cart
  So that I can review and purchase my items

  @smoke
  Scenario: Empty cart is handled gracefully
    Given I am on the Cart page
    Then the cart page loads without errors

  @regression
  Scenario: Adding a product shows it in the cart
    Given I am on the Products page
    When I add the first product to the cart
    And I navigate to the Cart page
    Then the cart contains at least one item

  @regression
  Scenario: Cart shows correct total after adding a product
    Given I am on the Products page
    When I add the first product to the cart
    And I navigate to the Cart page
    Then the cart total is greater than zero

  @regression
  Scenario: Removing an item decreases the cart count
    Given I am on the Products page
    When I add the first product to the cart
    And I navigate to the Cart page
    And I remove the first cart item
    Then the cart item count decreases

  @regression
  Scenario: Clicking Checkout shows a confirmation dialog
    Given I am on the Products page
    When I add the first product to the cart
    And I navigate to the Cart page
    And I click the Checkout button
    Then a confirmation dialog appears
    And I remain on the Cart page
