const videovar = document.getElementById("video");
const closeButton = document.getElementById("close-button");
const generatebutton = document.getElementById("generatebutton")
const generatebuttonTrigger = document.getElementById("generateImagebutton")
const restartbutton = document.getElementById("restartbutton")
const textarea = document.getElementById("subject")
const textareaImage = document.getElementById("subjectImage")
const playbutton = document.getElementById("playButton")
const downloadbutton = document.getElementById("downloadButton")
const readyText = document.getElementById("readyText")
const readyImageText = document.getElementById("readyImageText")
const generateImageButton = document.getElementById("generateImagebutton")
const videoTrigger = document.getElementById("videoTrigger")
const imageTrigger = document.getElementById("imageTrigger")
const chunkTrigger = document.getElementById("chunkTrigger")
const imageForm = document.getElementById("subjectImageForm")
const videoForm = document.getElementById("subjectForm")
const chunkGeneration = document.getElementById("chunkGeneration")
const imagePreview = document.getElementById("imagePreview")
const viewButton = document.getElementById("viewButton")
const downloadImageButton = document.getElementById("downloadImageButton")
const imagePreviewContainer = document.getElementById("imagePreviewContainer")
const streamImageContainer = document.getElementById("streamImageContainer")
const streamVideoContainer = document.getElementById("streamVideoContainer")
const uploadButton = document.getElementById("uploadButton")
const downloadChunkButton = document.getElementById("downloadChunkButton")
let title = "";


// THIS IS FOR THE GENERATE VIDEO BUTTON
document.getElementById("subjectForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    formdata = new FormData(event.target);
    console.log(formdata.entries());
    for (let [key, value] of formdata.entries()) {
        
        console.log(`${key}: ${value}`);
        title = value;
    }
    textarea.disabled = true
    generatebutton.disabled = true
    generatebutton.textContent = "Generating Video please wait..."
    generatebutton.classList.add("opacity-50", "cursor-not-allowed")
    videoTrigger.disabled = true
    videoTrigger.classList.add("cursor-not-allowed")
    imageTrigger.disabled = true
    imageTrigger.classList.add("cursor-not-allowed")

    try{
        const response = await fetch("http://87.106.135.198:5152/generateVideo", {
            method: "POST",
            body: formdata
        })

        if(response.ok){
            console.log("data sent");
            generatebutton.style.display = "none"
            restartbutton.style.display = "block"
            playbutton.disabled = false;
            downloadbutton.disabled = false;
            playbutton.classList.remove("cursor-not-allowed")
            downloadbutton.classList.remove("cursor-not-allowed")
            readyText.classList.remove("hidden")
        }else{
            throw new Error("failed to send")
            
        }

    } catch (error) {
        console.error("error", error);
        alert("error")
        textarea.disabled = false;
        generatebutton.disabled = false;
        generatebutton.textContent = "Generate Video";
        generatebutton.classList.remove("opacity-50", "cursor-not-allowed")
    }


})

//THIS IS FOR GENERATING IMAGE
document.getElementById("subjectImageForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    formdata = new FormData(event.target);
    console.log(formdata.entries());
    for (let [key, value] of formdata.entries()) {
        
        console.log(`${key}: ${value}`);
        title = value;
    }
    textareaImage.disabled = true
    generatebuttonTrigger.disabled = true
    generatebuttonTrigger.textContent = "Generating Image please wait..."
    generatebuttonTrigger.classList.add("opacity-50", "cursor-not-allowed")
    videoTrigger.disabled = true
    videoTrigger.classList.add("cursor-not-allowed")
    imageTrigger.disabled = true
    imageTrigger.classList.add("cursor-not-allowed")

    try{
        const response = await fetch("http://87.106.135.198:5152/generateImage", {
            // 87.106.135.198:5151
            method: "POST",
            body: formdata
        })

        if(response.ok){
            console.log(response)
            console.log("data sent");
            generatebuttonTrigger.style.display = "none"
            restartbutton.style.display = "block"
            viewButton.disabled = false
            viewButton.classList.remove("cursor-not-allowed")
            downloadImageButton.disabled = false
            downloadImageButton.classList.remove("cursor-not-allowed")
            readyImageText.classList.remove("hidden")

           
           
        }else{
            throw new Error("failed to send")
            
        }

    } catch (error) {
        console.error("error", error);
        alert("error")
    }


})

//THIS IS FOR CHUNKING VIDEO
document.getElementById("chunkGeneration").addEventListener("submit", async (event) => {
    event.preventDefault();
    const videoInput = document.getElementById("longVideoUpload");
    if (videoInput.files.length === 0) {
        alert("Please upload a video file.");
        return;
    }

    const videoFile = videoInput.files[0];
    const isAICutEnabled = document.getElementById("smartCut").checked;
    const processforReels = document.getElementById("processforReels").checked;

    let formData = new FormData();
    formData.append("video", videoFile);
    formData.append("ai_cut", isAICutEnabled);
    formData.append("forReels", processforReels);
    
    uploadButton.disabled = true
    uploadButton.textContent = "Chunking Video please wait..."
    uploadButton.classList.add("opacity-50", "cursor-not-allowed")
    videoTrigger.disabled = true
    videoTrigger.classList.add("cursor-not-allowed")
    imageTrigger.disabled = true
    imageTrigger.classList.add("cursor-not-allowed")
    chunkTrigger.disabled = true
    chunkTrigger.classList.add("cursor-not-allowed")

    fetch("http://87.106.135.198:5152/chunkVideo", {
        // http://87.106.135.198:5152
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
        
    })
    .then(data => {
        console.log(data);
        restartbutton.classList.remove("hidden")
        uploadButton.classList.add("hidden")
        downloadChunkButton.classList.remove("hidden")
        
    })
    .catch(error => {
        console.error("Error:", error);
    });

})


// THIS IS FOR STREAMING VIDEO
function loadVideo(){

    videovar.src= "http://87.106.135.198:5152/video";
    videovar.load();
    videovar.play();
    videovar.style.display= "block";
    closeButton.style.display = "block";
}


// THIS IS FOR DOWNLOADING VIDEO
async function downloadVideo(){
    const response = await fetch("http://87.106.135.198:5152/downloadVideo", {
        method: "POST"
    })

    if (!response.ok){
        throw new Error (`Error : ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url
    a.download = `${title}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
 // THIS IS FOR THE X BUTTON
function exitVideo(){
    videovar.style.display= "none";
    closeButton.style.display= "none";
    videovar.pause();
    videovar.src="";

}

// THIS IS FOR VIEWING IMAGE
function viewImage(){
    fetch(`http://87.106.135.198:5152/streamImage`)
    .then(response => response.blob())
    .then(imageBlob => {
        const imgUrl = URL.createObjectURL(imageBlob);
        imagePreview.src = imgUrl
        imagePreviewContainer.classList.remove("hidden")
        imagePreviewContainer.classList.add("flex")
    })
    .catch(error => console.error("Error fetching image:", error));
}

//THIS IS FOR DOWNLOADING IMAGE
async function downloadImage(){
    const response = await fetch("http://87.106.135.198:5152/downloadImage", {
        method: "POST"
    })

    if (!response.ok){
        throw new Error (`Error : ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url
    a.download = `${title}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}



// THIS IS FOR CHOOSING IMAGE , VIDEO AND CHUNK

function generateVideo(){
    videoForm.classList.remove("hidden")
    imageForm.classList.add("hidden")
    chunkGeneration.classList.add("hidden")
    videoTrigger.disabled = true
    videoTrigger.classList.add("cursor-not-allowed")
    imageTrigger.disabled = false
    imageTrigger.classList.remove("cursor-not-allowed")
    imageTrigger.classList.add("bg-slate-900")
    imageTrigger.classList.add("hover:bg-slate-800")
    imageTrigger.classList.remove("bg-slate-600")
    videoTrigger.classList.remove("bg-slate-900")
    videoTrigger.classList.remove("hover:bg-slate-800")
    videoTrigger.classList.add("bg-slate-600")
    videoTrigger.classList.add("border-red-600")
    imageTrigger.classList.remove("border-red-600")
    streamImageContainer.classList.add("hidden")
    streamVideoContainer.classList.remove("hidden")
    chunkTrigger.disabled = false
    chunkTrigger.classList.remove("cursor-not-allowed")
    chunkTrigger.classList.add("bg-slate-900")
    chunkTrigger.classList.add("hover:bg-slate-800")
    chunkTrigger.classList.remove("bg-slate-600")
    chunkTrigger.classList.remove("border-red-600")
    
    
}

function generateImage(){
    imageForm.classList.remove("hidden")
    videoForm.classList.add("hidden")
    chunkGeneration.classList.add("hidden")
    videoTrigger.disabled = false
    videoTrigger.classList.remove("cursor-not-allowed")
    imageTrigger.disabled = true
    imageTrigger.classList.add("cursor-not-allowed")
    imageTrigger.classList.remove("bg-slate-900")
    imageTrigger.classList.remove("hover:bg-slate-800")
    imageTrigger.classList.add("bg-slate-600")
    videoTrigger.classList.add("bg-slate-900")
    videoTrigger.classList.add("hover:bg-slate-800")
    videoTrigger.classList.remove("bg-slate-600")
    imageTrigger.classList.add("border-red-600")
    videoTrigger.classList.remove("border-red-600")
    streamImageContainer.classList.remove("hidden")
    streamVideoContainer.classList.add("hidden")
    chunkTrigger.disabled = false
    chunkTrigger.classList.remove("cursor-not-allowed")
    chunkTrigger.classList.add("bg-slate-900")
    chunkTrigger.classList.add("hover:bg-slate-800")
    chunkTrigger.classList.remove("bg-slate-600")
    chunkTrigger.classList.remove("border-red-600")

    
}

function generateChunkVideos(){
    imageForm.classList.add("hidden")
    videoForm.classList.add("hidden")
    chunkGeneration.classList.remove("hidden")
    videoTrigger.disabled = false
    videoTrigger.classList.remove("cursor-not-allowed")
    imageTrigger.disabled = false
    imageTrigger.classList.remove("cursor-not-allowed")
    imageTrigger.classList.add("bg-slate-900")
    imageTrigger.classList.add("hover:bg-slate-800")
    imageTrigger.classList.remove("bg-slate-600")
    videoTrigger.classList.add("bg-slate-900")
    videoTrigger.classList.add("hover:bg-slate-800")
    videoTrigger.classList.remove("bg-slate-600")
    imageTrigger.classList.remove("border-red-600")
    videoTrigger.classList.remove("border-red-600")
    streamImageContainer.classList.add("hidden")
    streamVideoContainer.classList.add("hidden")
    chunkTrigger.disabled = true
    chunkTrigger.classList.add("cursor-not-allowed")
    chunkTrigger.classList.remove("bg-slate-900")
    chunkTrigger.classList.remove("hover:bg-slate-800")
    chunkTrigger.classList.add("bg-slate-600")
    chunkTrigger.classList.add("border-red-600")

    
}
