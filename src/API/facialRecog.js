var fs = require('fs');
var subscriptionKey = "6301f2aa779741a3a6f1193cdb1ffbab";
var jParam = require('jquery-param');
var circularJSON = require('circular-json');

var axios = require('axios');

var personIdMap = new Map();
var personGroupId = "users";

var hello = function() {
    console.log(personIdMap.size);
};

var bradyDetectImage = "http://media.masslive.com/patriots/photo/tom-brady-10a4d266d94e40a3.jpg";

var bradyImages = [
    "https://cbsnews2.cbsistatic.com/hub/i/r/2017/09/15/8f7df144-762f-4dba-944a-1ff805ed9330/thumbnail/1200x630/272c9faa01900d987d4c0cb81ee0a1b2/0915-ctm-tombradypreview-odonnell-1397212-640x360.jpg",
    "https://cbsnews3.cbsistatic.com/hub/i/r/2017/09/18/39c85009-5a75-47d5-89c4-f6d46693d5ad/thumbnail/1200x630/580f70ca20194e50c20282053724b5da/0918-ctm-tombrady-finalweb-1399179-640x360.jpg",
    "http://www.patriots.com/sites/patriots.com/files/styles/gallery__lightbox/public/_gallery_photos/brady_tom_2014.jpg?itok=zIBNkeu5&timestamp=1449176585",
    "http://www.patriots.com/sites/patriots.com/files/styles/gallery__lightbox/public/_gallery_photos/brady_tom_2003.jpg?itok=HxOy3H1p&timestamp=1449178423",
    "http://cdn3-www.craveonline.com/assets/uploads/2017/03/Tom-Brady-jpeg-e1489595356193.jpg",
    "http://cdn-img.instyle.com/sites/default/files/styles/622x350/public/images/2016/01/011316-tom-brady-lead.jpg?itok=FOsGTzok",
    "https://www.biography.com/.image/t_share/MTQ0ODY2Mzc4OTI5Njc3Njg2/tom_brady_michael_loccisano_getty_images_609582044_profile.jpg",
    "https://cdn-s3.si.com/images/tom-brady-hair-14-jon-gruden-2011.jpg"
];

var setupUser = function(name, imgSrcs){
    createPerson(name, imgSrcs);
};

var getPerson = function(personIdx) {
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons/{personId}";
    var params = {
        "personGroupId": personGroupId,
        "personId": personIdx
    };
    console.log("PersonId: " + personIdx);
    var body = {

    };
    request('GET', params, uriBase, body)
    .then((response)=> {
        console.log(circularJSON.stringify(response));
        var valid = circularJSON.stringify(response).includes("Melvin") ? "MATCH" : "NO MATCH";
        console.log("IT IS A " + valid);
    })
    .catch((err)=>{
        console.log("ERROR: " + err);
    });  
};

var getPersonGroup = function() {
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{productGroupId}";
    var param = {
        "personGroupId": "sample_group"
    };
    var body = {

    };

    request('GET', param, uriBase, body)
    .then((response)=> {
        console.log(response.data);
    });  
};

var createPersonGroup = function() {
    
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}";
    var param = {
        "personGroupId": personGroupId
    };
    var body = {
        "name": personGroupId
    };

    request('PUT', param, uriBase, body)
    .then((response)=> {
        console.log("Successfully create person group");
    });
}

var createPerson = function(name, imgSrc) {
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons";
    var param = {
        "personGroupId": personGroupId
    };
    var body = {
        "name": name
    };
    
    request('POST', param, uriBase, body)
    .then((response) => {
        personIdMap.set(name, response.data.personId); 
        console.log("User " + name + " has been added with personId " + response.data.personId);
    })
    .then(()=>{
        console.log("adding faces to user " + name);
        addFaceToPerson(name, imgSrc);
    })
    .catch((err) => {
        console.log("Error in Creating user: " + err);
    });
}

var addFaceToPerson = function(name, imgSrcs) {
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons/{personId}/persistedFaces";
    console.log(personIdMap);
    var params = {
        "personGroupId": personGroupId,
        "personId": personIdMap.get(name),
    };
    imgSrcs.forEach((file) => {
        var body = {
            "url": file
        }
        request('POST', params, uriBase, body)
        .then((response) => {
            console.log("File has been read " + file);
        })
        .catch((err) => {
            console.log("Error adding faces to person " + name + " | " + err);
        });
    });
    postTrainingGroup();
};

var identifyPerson = function(faceIds){
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/identify";
    console.log("faceIds: " + faceIds);
    var params = {

    };
    var body = {
        "faceIds": [faceIds],
        "personGroupId": personGroupId,
        "maxNumOfCandidatesReturned":1,
        "confidenceThreshold": 0.5
    }
    request('POST', params, uriBase, body)
    .then((response) => {
        console.log(response.data[0].faceId);
        console.log(response.data[0].candidates);
        return response.data[0].candidates[0].personId;
    })
    .then((personId)=> {
        getPerson(personId);
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
}

//doesn't work
var getListOfPersonInPersonGroup = function() {
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons[?start][&top]";
    var params = {
        "personGroupId": personGroupId
    };
    var body = {

    };
    request('GET', params, uriBase, body)
    .then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
};

//kinda useless
var getPersonGroupId = function() {
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId";
    var params = {
        "personGroupId": personGroupId
    };
    var body = {

    };
    request('GET', params, uriBase, body)
    .then((response) => {
        console.log(response.data);
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
};

var postTrainingGroup = function() {
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/train";
    var params = {
        "personGroupId": personGroupId
    };
    var body = {

    };
    request('POST', params, uriBase, body)
    .then((response) => {
        console.log(response.status);
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
};

var getTrainingStatus = function() {

    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/training";
    var params = {
        "personGroupId": personGroupId
    };
    var body = {

    };
    request('GET', params, uriBase, body)
    .then((response) => {
        console.log(response.status);
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
};

var detectFace = function(imageSrc) {

    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    };
    var body = {
        "url": imageSrc
    };
    
    request('POST', params, uriBase, body)
    .then((response) => {
        console.log(response.data[0].faceId);
        identifyPerson(response.data[0].faceId);
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
};

// var detectFaceWithArrayBytes = function(filePath) {
    
//     var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";
//     var params = {
//         "returnFaceId": "true",
//         "returnFaceLandmarks": "false",
//         "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
//     };

//     console.log(filePath);
//     var file = fs.readFile(filePath, (err, data)=> {
//         var body = {
//             data
//         };
//         request('POST', params, uriBase, body, contentType = 'application/octet-stream')
//         .then((response) => {
//             console.log(response.data[0].faceId);
//             //identifyPerson(response.data[0].faceId);
//         })
//         .catch((err) => {
//             console.log("ERROR: " + err);
//         });
//     });

// /*    var body = {
//         imageBytes
//     };
    
//     request('POST', params, uriBase, body, contentType = 'application/octet-stream')
//     .then((response) => {
//         console.log(response.data[0].faceId);
//         //identifyPerson(response.data[0].faceId);
//     })
//     .catch((err) => {
//         console.log("ERROR: " + err);
//     });
//     */
// };

module.exports = {setupUser, getListOfPersonInPersonGroup, getPersonGroupId, postTrainingGroup, getTrainingStatus, createPersonGroup, createPerson, addFaceToPerson, getPersonGroup, hello, detectFace};

var request = function(requestMethod, requestParams, uriBase, body, contentType = 'application/json') {
    return axios({
        method: requestMethod,
        baseURL: uriBase,
        headers: {'Content-Type': contentType, 'Ocp-Apim-Subscription-Key':subscriptionKey},
        params: requestParams,
        data: body
    })
    .then((response) => {
        return response;
    })
    .catch((err)=> {
        console.log("ERROR: " + err);
    });
};


