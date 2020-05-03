var savedCv = localStorage.getItem("CV");
var printable = document.getElementById("printable");

//Define content to be displayed
function setContent(cvContent) {
    var loadedCv = convertSavedData(cvContent);
    printable.innerHTML = loadedCv;
    console.log("content updated");
}

// Load default or saved content when page loads
window.addEventListener("load", function () {
    if (!savedCv) {
        setContent(defaultCv);
    } else {
        setContent(JSON.parse(savedCv));
    }
});

//Set default content when reset button is clicked and delete local storage
document.getElementById("reset-btn").addEventListener("click", function () {
    setContent(defaultCv);
    localStorage.clear();
});

//Save to local storage when save button is clicked
document.getElementById("save-btn").addEventListener("click", function () {
    var currentCv = saveCvToArray();
    localStorage.setItem("CV", JSON.stringify(currentCv));
});

//Save to PDF with html2pdf when download pdf button is clicked
var toBePrinted = document.getElementById("printable");
var printOptions = {
    filename: "cv.pdf",
    pagebreak: { mode: "avoid-all" },
};
function toPDF() {
    html2pdf(toBePrinted, printOptions);
}
document.getElementById("download-btn").addEventListener("click", toPDF);

//Testing loading content to page from JSON

document.getElementById("test-btn").addEventListener("click", function () {
    var loadedCv = convertSavedData(defaultCv);
    setContent(loadedCv);
});

//Traversing JSON data, returns CV data as formatted HTML
function convertSavedData(savedCV) {
    var sectionsArray = [];

    for (i in savedCV) {
        var convertedList = "";
        var type = savedCV[i].type;
        var title = savedCV[i].title;
        var itemList = [];
        var name = savedCV[i].name;
        var table1 = savedCV[i].table1;
        var table2 = savedCV[i].table2;
        for (j in savedCV[i].list) {
            itemList[j] = savedCV[i].list[j];
        }

        //Formatting if section is the main info content
        if (type === "info") {
            //debugger;
            var dataTable1 = "";
            var dataTable2 = "";
            for (var j = 0; j < table1.label.length; j++) {
                if (j === 0) {
                    dataTable1 += `<div class="col"><table class="table table-borderless info-table1"><tr><th class="text-right" contenteditable="true">${table1.label[j]}</th><td contenteditable="true">${table1.content[j]}</td></tr>`;
                } else if (j === table1.label.length - 1) {
                    dataTable1 += `<tr><th class="text-right" contenteditable="true">${table1.label[j]}</th><td contenteditable="true">${table1.content[j]}</td></tr></table></div>`;
                } else if (table1.label.length === 1) {
                    dataTable1 += `<div class="col"><table class="table table-borderless"><tr><th class="text-right" contenteditable="true">${table1.label[j]}</th><td contenteditable="true">${table1.content[j]}</td></tr></table></div>`;
                } else {
                    dataTable1 += `<tr><th class="text-right" contenteditable="true">${table1.label[j]}</th><td contenteditable="true">${table1.content[j]}</td></tr>`;
                }
            }

            for (var j = 0; j < table2.label.length; j++) {
                if (j === 0) {
                    dataTable2 += `<div class="col"><table class="table table-borderless info-table2"><tr><th class="text-right" contenteditable="true">${table2.label[j]}</th><td contenteditable="true">${table2.content[j]}</td></tr>`;
                } else if (j === table2.label.length - 1) {
                    dataTable2 += `<tr><th class="text-right" contenteditable="true">${table2.label[j]}</th><td contenteditable="true">${table2.content[j]}</td></tr></table></div>`;
                } else if (table2.label.length === 1) {
                    dataTable2 += `<div class="col"><table class="table table-borderless"><tr><th class="text-right" contenteditable="true">${table2.label[j]}</th><td contenteditable="true">${table2.content[j]}</td></tr></table></div>`;
                } else {
                    dataTable2 += `<tr><th class="text-right" contenteditable="true">${table2.label[j]}</th><td contenteditable="true">${table2.content[j]}</td></tr>`;
                }
            }

            var convertedData = `<section id="section${i}" class="${type}">
            <h2 contenteditable="true" class="text-center info-name">${name}</h2><div class="row">${
                dataTable1 + dataTable2
            }</div></section>`;
            sectionsArray.push(convertedData);
        }

        //Formatting if section is a list with dates, such as experience
        if (type === "listing") {
            for (j in itemList) {
                convertedList += `<div class="row listing-row">
                <div class="col-md-2">
                    <h5 contenteditable="true" class="listing-date">${itemList[j].date}</h5>
                </div>
                <div class="col-md-2">
                    <h5 contenteditable="true" class="listing-location">${itemList[j].location}</h5>
                </div>
                <div class="col-md-8">
                    <h5 contenteditable="true" class="listing-position">
                    ${itemList[j].position}
                    </h5>
                    <p contenteditable="true" class="listing-description">
                    ${itemList[j].description}
                    </p>
                </div>
            </div>`;
            }
            var convertedData = `<section class="${type}" id="section${i}">
            <h3 contenteditable="true" class="listing-title section-heading">${title}</h3>${convertedList}</section>`;
            sectionsArray.push(convertedData);
        }
        //Formatting if section is a single block of content
        if (type === "single-block") {
            for (j in itemList) {
                convertedList += `<div class="row"><div class="col"><p contenteditable="true" class="single-block-content">${itemList[j]}</p></div></div>
            </div>`;
            }
            var convertedData = `<section class="${type}" id="section${i}">
            <h3 contenteditable="true" class="section-heading single-block-title">${title}</h3>${convertedList}</section>`;
            sectionsArray.push(convertedData);
        }

        //Formatting if section is a list of items, such as skills/interests
        if (type === "3-column") {
            //Add empty columns if number of items is not divisible by 3
            while (itemList.length % 3 != 0) {
                itemList.push("");
            }
            for (j in itemList) {
                //first row of listed items
                if (j % 3 === 0) {
                    convertedList += `<div class="row">
                                    <div class="col">
                                    <p contenteditable="true" class="3-col-item">${itemList[j]}</p>
                                    </div>`;
                    //last row of listed items
                } else if (j % 3 === 2) {
                    convertedList += `<div class="col">
                                    <p contenteditable="true" class="3-col-item">${itemList[j]}</p>
                                    </div></div>`;
                    //all other rows of listed items
                } else {
                    convertedList += `<div class="col">
                                    <p contenteditable="true" class="3-col-item">${itemList[j]}</p>
                                    </div>`;
                }
            }
            var convertedData = `<section class="${type}" id="section${i}">
                <h3 contenteditable="true" class="section-heading 3-col-title">${title}</h3>
                ${convertedList}</section>`;
            sectionsArray.push(convertedData);
        }
    }

    return sectionsArray.join("<hr>");
}

//Saving Content on page to an array
function saveCvToArray() {
    var savedArray = [];
    var sections = $("#printable section");
    for (i in sections) {
        //debugger;
        var sectionId = "section" + i;
        //Converts Info section into an object
        if (sections.eq(i).hasClass("info")) {
            savedArray[i] = {};
            savedArray[i].type = "info";
            savedArray[i].name = $("#" + sectionId + " .info-name").html();
            savedArray[i].table1 = { label: [], content: [] };
            savedArray[i].table2 = { label: [], content: [] };
            $("#" + sectionId + " .info-table1 th").each(function () {
                savedArray[i].table1.label.push($(this).html());
            });
            $("#" + sectionId + " .info-table1 td").each(function () {
                savedArray[i].table1.content.push($(this).html());
            });
            $("#" + sectionId + " .info-table2 th").each(function () {
                savedArray[i].table2.label.push($(this).html());
            });
            $("#" + sectionId + " .info-table2 td").each(function () {
                savedArray[i].table2.content.push($(this).html());
            });

            //Converts 3-column section into object
        } else if (sections.eq(i).hasClass("3-column")) {
            savedArray[i] = {};
            savedArray[i].type = "3-column";
            savedArray[i].title = $("#" + sectionId + " .3-col-title").html();
            savedArray[i].list = [];
            $("#" + sectionId + " .3-col-item").each(function () {
                savedArray[i].list.push($(this).html());
            });

            // Converts listing section into an object
        } else if (sections.eq(i).hasClass("listing")) {
            savedArray[i] = {};
            savedArray[i].type = "listing";
            savedArray[i].title = $("#" + sectionId + " .listing-title").html();
            savedArray[i].list = [];
            $("#" + sectionId + " .listing-row").each(function () {
                var listingRow = {};
                listingRow.date = $(this).find(".listing-date").html();
                listingRow.location = $(this).find(".listing-location").html();
                listingRow.position = $(this).find(".listing-position").html();
                listingRow.description = $(this)
                    .find(".listing-description")
                    .html();

                savedArray[i].list.push(listingRow);
            });
        } else if (sections.eq(i).hasClass("single-block")) {
            savedArray[i] = {};
            savedArray[i].type = "single-block";
            savedArray[i].title = $(
                "#" + sectionId + " .single-block-title"
            ).html();
            savedArray[i].list = [];
            $("#" + sectionId + " .single-block-content").each(function () {
                savedArray[i].list.push($(this).html());
            });
        }
    }
    return savedArray;
}

//Default CV loaded on page
var defaultCv = [
    {
        type: "info",
        name: "John Doe",
        table1: {
            label: ["Address:", "Phone:", "Email:"],
            content: [
                "123 State St.<br>Oslo, Norway",
                "555-123-4567",
                "john@doe.io",
            ],
        },
        table2: {
            label: ["Website:", "Twitter:"],
            content: ["htttps://johndoe.com", "@johndoe"],
        },
    },
    {
        type: "single-block",
        title: "About",
        list: ["I'm a self made man who enjoys the good things in life."],
    },
    {
        type: "listing",
        title: "Professional Experience",
        list: [
            {
                date: "2019-2020",
                location: "Bigstore Management",
                position: "Director of Sales",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae aspernatur repellat quis hic sunt harum deleniti perferendis necessitatibus reprehenderit minima vero unde assumenda id adipisci consequuntur consectetur, sint dignissimos omnis voluptates ratione eaque eos? Iste repellendus facere, eveniet tempora unde laboriosam adipisci, illo obcaecati blanditiis quibusdam assumenda, beatae soluta temporibus?",
            },
            {
                date: "2017-2019",
                location: "Elephant Inc.",
                position: "Communication Strategist",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae aspernatur repellat quis hic sunt harum deleniti perferendis necessitatibus reprehenderit minima vero unde assumenda id adipisci consequuntur consectetur, sint dignissimos omnis voluptates ratione eaque eos? Iste repellendus facere, eveniet tempora unde laboriosam adipisci, illo obcaecati blanditiis quibusdam assumenda, beatae soluta temporibus?",
            },
            {
                date: "2015-2017",
                location: "Elephant Inc.",
                position: "Sales Assistant",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae aspernatur repellat quis hic sunt harum deleniti perferendis necessitatibus reprehenderit minima vero unde assumenda id adipisci consequuntur consectetur, sint dignissimos omnis voluptates ratione eaque eos? Iste repellendus facere, eveniet tempora unde laboriosam adipisci, illo obcaecati blanditiis quibusdam assumenda, beatae soluta temporibus?",
            },
        ],
    },
    {
        type: "listing",
        title: "Education",
        list: [
            {
                date: "2011-2015",
                location: "University of Oslo",
                position: "Masters in Business",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae aspernatur repellat quis hic sunt harum deleniti perferendis necessitatibus",
            },
            {
                date: "2010-2011",
                location: "University of Bergen",
                position: "Bachelor in Communications",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae aspernatur repellat quis hic sunt harum deleniti perferendis necessitatibus",
            },
        ],
    },
    {
        type: "3-column",
        title: "Skills",
        list: [
            "-Salesforce",
            "-Teamwork",
            "-Fashion Sense",
            "-Martial Arts",
            "-Advanced Gymnastics",
            "-Fishing",
        ],
    },
    {
        type: "3-column",
        title: "Interests",
        list: [
            "-Books",
            "-Video Games",
            "-Baking",
            "-Fruit Juice",
            "-Flexing",
            "-Brewing",
            "-Cruising",
        ],
    },
];
