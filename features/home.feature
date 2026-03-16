Feature: FashionHub Home Page

  As a visitor
  I want to see the FashionHub home page
  So that I can explore the shop

  Background:
    Given I am on the Home page

  Scenario: Smoke — Home page loads with correct title
    Then the page title contains "FashionHub"

  Scenario: Hero section is visible with a welcome heading
    Then the hero section is visible
    And it contains a welcome heading

  Scenario: Navigation bar contains all expected links
    Then the navigation bar contains a link to "Clothing"
    And the navigation bar contains a link to "About"

  Scenario: Feature highlights section displays three items
    Then the feature section shows at least 3 highlight items

  Scenario: Shop Now button navigates to the Products page
    When I click the "Shop Now" button
    Then the Products page is displayed
