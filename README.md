This is the project done in the course "The Web Developer BootCamp" by Colt Steele in Udemy.

It is a app which publishes crowd sourced reviews on the campgrounds they have visited. 

The folder middleware consists of a file index.js which has several funtions in it to take care of the authentication part. No one can add campgrounds/comments unless he/she is logged in. User cannot edit the data which he is not owner of. Passport.js is used in this section.

The models folder has the files which describe models in the database. In this project MongoDB is used.

The public folder has stylesheets.

The folder routes has different files for different models defining routes for CRUD operations on them.

The views folder has files which are responsible for the front end looks.

app.js is the file where everything starts. It setups everything for the application.
