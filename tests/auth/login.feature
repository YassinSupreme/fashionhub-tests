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

  Scenario Outline: Invalid credentials keep the user on the login page
    When I enter username "<username>" and password "<password>"
    Then I remain on the Login page

    Examples:
      | username         | password      | reason                     |
      | demouser         | wrongpassword | correct user, wrong pass   |
      | nonexistentuser  | fashion123    | user does not exist        |
      | demouser         | 123           | password too short         |
      | admin            | admin         | unregistered admin account |

  Scenario: Submitting empty credentials stays on login page
    When I click the Login button without entering credentials
    Then I remain on the Login page
