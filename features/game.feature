Feature: Flarie Game Testing
    As a user
    I want to access the Flarie game
    So that I can verify the game loads correctly

    Scenario: Open Flarie game page
        Given I am on the Flarie game website
        When the page loads completely
        Then I should see the game interface 