document.addEventListener("DOMContentLoaded",function(){
    const searchButton = document.getElementById("search-button");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");

    function validateUserName(username) {
        if (username.trim()==="") {
            alert("username should not be empty")
            return false
        }
        const regex= /^[a-zA-Z0-9 -]{1,15}$/;
        const ismatch=regex.test(username);
        if (!ismatch) {
            alert("Invalid Username")
        }
        return ismatch;
    }

    async function fetchUserDetails(username) {
        
        try {
            // statsContainer.style.setProperty("display",hidden)
            searchButton.textContent="Searching...";
            searchButton.disabled=true
            // const response=await fetch(url);
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
            const targetUrl = 'https://leetcode.com/graphql/';
            
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect:"follow"
            };
            const response=await fetch(proxyUrl+targetUrl,requestOptions);

            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }
            const parsedData = await response.json()
            console.log("Logging data: ",parsedData)
            displayUserData(parsedData)
        } 
        catch (error) {
            statsContainer.innerHTML=`<p>No data found</p>`
        }
        finally{
            searchButton.textContent="Search"
            searchButton.disabled = false;
        }
    }
    function updateProgress(solved,total,label,circle) {
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
    }

    function displayUserData(parsedData) {
        const totalQues=parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues=parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues=parsedData.data.allQuestionsCount[2].count;
        const totalHardQues=parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedEasyQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMediumQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHardQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
        updateProgress(solvedMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardData=[
            {label:"Overall Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
            {label:"Overall Easy Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
            {label:"Overall Medium Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
            {label:"Overall Hard Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions}
        ]
        console.log("card ka data ", cardData)

        cardStatsContainer.innerHTML=cardData.map(
            data=>
                 `
                <div class="card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
                </div>
                `
            ).join(" ")
    }


    searchButton.addEventListener('click',function() {
        const username=usernameInput.value;
        console.log("logging username:", username)
        if (validateUserName(username)) {
            fetchUserDetails(username)
        }
    })
})