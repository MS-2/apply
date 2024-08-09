# React Native Developer Challenge

## Introduction

This document outlines the requirements and guidelines for completing the React Native Developer Challenge. Your task is to create a mobile application that demonstrates your skills in using React Native and related technologies to build a functional, user-friendly app.

## Objective

Build a mobile application that fetches and displays articles from Hacker News, with functionalities for offline access, article management, and user notifications.

## Features

### Core Functionality

- **Data Fetching**: Upon startup and on pull-to-refresh, the app should fetch articles related to Android or iOS from the Hacker News Algolia API: `https://hn.algolia.com/api/v1/search_by_date?query=mobile`.
- **Offline Access**: The app must display articles downloaded during the last session when offline.
- **Article Viewing**: Articles should be listed in a scrollable view, sorted by date. Tapping an article opens it in an in-app web view.
- **Delete Functionality**: Users can swipe to delete articles from the list. Deleted articles should not reappear upon data refresh.

### Enhanced Features

- **Favorites**: Users can mark articles as favorites. These should be accessible from a dedicated favorites screen.
- **Deleted Articles View**: Include a screen to view articles that have been deleted.

### Feature: Push Notifications for New Articles

### Overview

To keep users engaged and informed about the latest articles that match their interests, we are introducing a feature that sends push notifications to the user's device whenever new articles that meet certain criteria are posted.

### Requirements

- **Push Notification Permission**: On the first launch, the app should request permission from the user to send push notifications.
- **User Preferences**: Allow users to set preferences for the types of articles they are interested in receiving notifications about. For instance, users could choose to receive notifications only for articles related to "Android" or "iOS".
- **Background Fetch**: Implement a background process that periodically checks the Algolia API for new articles that match the user's preferences. If new articles are found, a push notification is sent to the user's device.
- **Notification Interaction**: When a user taps on a notification, the app should open and display the article mentioned in the notification.

### Privacy and User Experience Considerations

- Clearly communicate to the user why push notification permission is being requested and how it will enhance their experience.
- Provide users with full control over their notification preferences, including an option to disable notifications entirely.

### Technical Specifications

- **Language**: TypeScript.
- **Unit Testing**: Include unit tests demonstrating the application's reliability. Aim for meaningful test coverage.
- **Third-Party Libraries**: You are free to use third-party libraries as needed to complete the challenge.

## Submission

- **Code Repository**: Submit your code as a public GitHub repository. Include a `README.md` with setup and running instructions.
- **Unit Tests**: Ensure your repository includes unit tests. The `README.md` should also detail how to run these tests.

## Evaluation Criteria

- **Functionality**: The application meets all the specified requirements.
- **Code Quality**: Your code should be clean, well-organized, and follow best practices.
- **UI/UX**: While the provided wireframe serves as a foundational guide for the application's design, it is not a strict blueprint. We encourage you to use it as a starting point and welcome any enhancements or creative modifications you believe will improve the user experience.
- **Documentation**: Your `README.md` should clearly explain how to set up, run the application, and execute unit tests.

Thank you for participating in this challenge. We look forward to reviewing your submission. If you have any questions, please feel free to reach out.

Good luck!
