Feature: FashionHub Login

  As a registered user
  I want to log in to FashionHub
  So that I can access my account

  Background:
    Given I am on the Login page

  Scenario: Smoke — Login page loads with a visible form
    Then the login form is visible

  Scenario: Valid login redirects to account page
    When I enter valid credentials
    Then I am redirected to the Account page
    And I see a welcome message with my username

  Scenario: Wrong password stays on login page
    When I enter username "demouser" and password "wrongpassword"
    Then I remain on the Login page

  Scenario: Wrong username stays on login page
    When I enter username "nonexistentuser" and password "fashion123"
    Then I remain on the Login page

  Scenario: Submitting empty credentials stays on login page
    When I click the Login button without entering credentials
    Then I remain on the Login page
