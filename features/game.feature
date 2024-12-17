Feature: Flarie Game Testing
    As a user
    I want to access the Flarie game
    So that I can verify all game elements load correctly

    Scenario: Open Flarie game page and verify elements
        Given I am on the Flarie game website
        When the page loads completely
        Then I should see the game interface 
        Then the leaderboard should be ranked correctly
        When I click the Start Game button and wait for 3 seconds
        When I enter the email and username and submit the form
        And I perform the game clicks sequence