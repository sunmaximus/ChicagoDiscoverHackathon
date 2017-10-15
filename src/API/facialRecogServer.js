var facialRecog = require('./facialRecog.js');
var $ = require('jquery');
var bradyDetectImage = "http://media.masslive.com/patriots/photo/tom-brady-10a4d266d94e40a3.jpg";

var melvinDetectImage = "http://image.ibb.co/eHG9iw/Screen_Shot_2017_10_14_at_11_58_57_PM.png";

var melvinImages = [
    "http://image.ibb.co/gMSJAb/IMG_3943.jpg",
    "http://image.ibb.co/eeen3w/IMG_3944.jpg",
    "http://image.ibb.co/gbwpGG/IMG_3945.jpg",
    "http://image.ibb.co/b7dQqb/IMG_3946.jpg",
    "http://image.ibb.co/cdMBVb/IMG_3947.jpg",
    "http://image.ibb.co/hom0Ow/IMG_3948.jpg",
    "http://image.ibb.co/kAwdAb/IMG_3949.jpg",
    "http://image.ibb.co/iVOQqb/IMG_3950.jpg",
    "http://image.ibb.co/bK4n3w/IMG_3951.jpg",
    "http://image.ibb.co/hzLS3w/IMG_3952.jpg",
    "http://image.ibb.co/g7sJAb/IMG_3953.jpg",
    "http://image.ibb.co/cPtfOw/IMG_3954.jpg"
];

//facialRecog.setupUser("Melvin", melvinImages);
//console.log(axios);
//console.log($.ajax());
//facialRecog.createPersonGroup();
//facialRecog.createPerson("Brady");
//facialRecog.createPerson("Brady");
facialRecog.detectFace(melvinDetectImage);
//facialRecog.getPersonGroupId();
//facialRecog.getListOfPersonInPersonGroup();
//facialRecog.getListOfPersonInPersonGroup();
//facialRecog.getTrainingStatus();
//facialRecog.hello();
//facialRecog.addFaceToPerson("Johnny", "Users", "./Data", "ID");