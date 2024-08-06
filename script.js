let word = document.getElementById("word")
let search = document.getElementById("inputData")
let searchBtn = document.getElementById("searchBtn")
let container = document.getElementById("container")
let template = document.getElementById("boxTemplate").content.firstElementChild
console.log(template)
searchBtn.addEventListener("click", () => {
    if (String(search.value).trim() != "") {
        GetMeaning()
    }
})
addEventListener("keyup", (e) => {
    if (e.keyCode == 13) {
        // if (String(search.value).trim() != "") {
        //     GetMeaning()
        // }
        searchBtn.click()
    }
})


async function GetMeaning() {
    let input = String(search.value).trim()
    await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`)
        .then((response) => {
            return response.json()
        }).then((data) => {
            word.innerHTML = (input.slice(0, 1)).toUpperCase() + input.slice(1)
            for (let i = 0; i < data[0].phonetics.length; i++) {
                let audioUrl = data[0].phonetics[i].audio
                if (audioUrl != "") {
                    audio = new Audio(audioUrl)
                    break
                } else {
                    audio = new Audio("")
                }
            }
            container.innerHTML = ""
            for (let i = 0; i < data[0].meanings.length; i++) {
                let box = template.cloneNode(true)

                box.children[0].innerHTML = data[0].meanings[i].partOfSpeech.slice(0, 1).toUpperCase() + data[0].meanings[i].partOfSpeech.slice(1)

                box.children[1].innerHTML = data[0].meanings[i].definitions[0].definition

                if (data[0].meanings[i].synonyms != 0) {
                    let synonyms = ""
                    for (let n = 0; n < data[0].meanings[i].synonyms.length; n++) {
                        synonyms += data[0].meanings[i].synonyms[n] + ", "
                        if(n>4){
                            break
                        }
                    }
                    box.children[2].innerHTML = synonyms.slice(0, synonyms.length - 2)
                }
                if (example = data[0].meanings[i].definitions[0].example != null) {
                    let example = data[0].meanings[i].definitions[0].example.split(" ")
                    example = example.map((x) => {
                        if (x.includes(input) || x.includes(input.toLowerCase())) {
                            x = "<b>" + x + "</b>"
                        }
                        return x
                    })
                    box.children[3].innerHTML = example.join(" ")
                }

                container.appendChild(box)
            }
            console.log(data[0].meanings)
        }).catch((error) => {
            console.log(error)
            word.innerHTML = "Not Found"
        })
}


// audio
let audio = new Audio("media\\default.mp3")
const audioBtn = document.getElementById("audioBtn")
audioBtn.addEventListener("click", () => {
    audio.play()
})
