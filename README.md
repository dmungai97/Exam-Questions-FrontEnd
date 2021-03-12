# examquestionsvue

Exam Questions was developed to randomly assign one of several questions from a pool to students. By giving students one of several variations, it is less likely that cheating will occur.

It is possible to use D2L's quiz pool to attempt the same thing, but their random process leaves something to be desired. Since they generate a number between 1 and the number of variations, and then assign that to the student, it ends up with an uneven distribution because, over a short run, random number generators don't necessarily evenly distribute across the possible options.

This application solves that by dealing with the question pool as if it were a deck of cards. Once the card is gone, it cannot be distributed again. For example, if you have ten options and twenty-three students, then three (rounding up from 2.3) of each option are put into our deck for a total of thirty. Once one student is assigned the first question, there are twenty-nine in the deck and so on until all students have been assigned a question. In this example, some questions will be assigned three times, and others only twice. But no question will be assigned more than three times and no question will remain unused.

The application also records the IP address of the requestor and tries to ensure that no two students at the same IP address get the same question. It does, however, still provide a question if that requirement cannot be met - like if all your students are in the same room.

The application is written in JavaScript using the VueJS framework. Styling is done with the Bootstrap-vue project. The vue-i18n project is used to localize text. Signalr via the @latelier/vue-signalr project is used to notify the client whenever a student receives an allocation of documents.

This project pairs with the Web API implemented in my examQuestionCore repository.
