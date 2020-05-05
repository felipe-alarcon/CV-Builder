//Listing Type Objects get converted to HTML
function listingToHtml(i, list, title) {
    let htmlList = "";
    for (j in list) {
        htmlList += `<div class="row listing-row deletable">
        <div class="col-md-2">
            <h5 contenteditable="true" class="listing-date">${list[j].date}</h5>
        </div>
        <div class="col-md-2">
            <h5 contenteditable="true" class="listing-location">${list[j].location}</h5>
        </div>
        <div class="col-md-8 pb-4">
            <h5 contenteditable="true" class="listing-position">
            ${list[j].position}
            </h5>
            <div contenteditable="true" class="listing-description">
            ${list[j].description}
            </div>
        </div>
    </div>`;
    }
    return `<section class="listing" id="section${i}">
    <h3 contenteditable="true" class="listing-title section-heading">${title}</h3>${htmlList}</section>`;
}

//Single-Block type items get converted to HTML
function singleBlockToHtml(i, list, title) {
    let htmlList = "";
    for (j in list) {
        htmlList += `<div class="row"><div class="col"><div contenteditable="true" class="single-block-content">${list[j]}</div></div></div>
</div>`;
    }
    return `<section class="single-block" id="section${i}">
<h3 contenteditable="true" class="section-heading single-block-title">${title}</h3>${htmlList}</section>`;
}

//Three-Column type items get converted to HTML
function threeColToHtml(i, list, title) {
    let htmlList = "";
    //Add empty columns if number of items is not divisible by 3
    while (list.length % 3 != 0) {
        list.push("");
    }
    for (j in list) {
        //first row of listed items
        if (j % 3 === 0) {
            htmlList += `<div class="row">
                            <div class="col">
                            <p contenteditable="true" class="3-col-item">${list[j]}</p>
                            </div>`;
            //last row of listed items
        } else if (j % 3 === 2) {
            htmlList += `<div class="col">
                            <p contenteditable="true" class="3-col-item">${list[j]}</p>
                            </div></div>`;
            //all other rows of listed items
        } else {
            htmlList += `<div class="col">
                            <p contenteditable="true" class="3-col-item">${list[j]}</p>
                            </div>`;
        }
    }
    return `<section class="3-column" id="section${i}">
        <h3 contenteditable="true" class="section-heading 3-col-title">${title}</h3>
        ${htmlList}</section>`;
}

//Info type items get converted to HTML
function infoToHtml(i, table1, table2, name) {
    var dataTable1 = convertTableToHtml(table1);
    var dataTable2 = convertTableToHtml(table2);

    return `<section id="section${i}" class="info">
            <h2 contenteditable="true" class="text-center info-name">${name}</h2><div class="row">${
        dataTable1 + dataTable2
    }</div></section>`;
}

//Table in Info section get converted to HTML
function convertTableToHtml(table) {
    let dataTable = "";
    for (let i = 0; i < table.label.length; i++) {
        if (table.label.length === 1) {
            //Table has only 1 row => open and close div tag
            dataTable += `<div class="col"><table class="table table-borderless ${table.class}"><tr><th class="text-right" contenteditable="true">${table.label[i]}</th><td contenteditable="true">${table.content[i]}</td></tr></table></div>`;
        } else if (i === 0) {
            //First row of the table => open div tag
            dataTable += `<div class="col-6"><table class="table table-borderless table-sm ${table.class}"><tr><th class="text-right" contenteditable="true">${table.label[i]}</th><td contenteditable="true">${table.content[i]}</td></tr>`;
        } else if (i === table.label.length - 1) {
            //Last row of the table => close div tag
            dataTable += `<tr><th class="text-right" contenteditable="true">${table.label[i]}</th><td contenteditable="true">${table.content[i]}</td></tr></table></div>`;
        } else {
            //Every other row
            dataTable += `<tr><th class="text-right" contenteditable="true">${table.label[i]}</th><td contenteditable="true">${table.content[i]}</td></tr>`;
        }
    }
    return dataTable;
}