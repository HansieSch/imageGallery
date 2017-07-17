console.log("Loaded");

var dltButtons = document.querySelectorAll(".card .content .btn.dlt");

dltButtons.forEach((el, ind, arr) => {
    el.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        atomic.delete("http://127.0.0.1:8000/deleteFile?fileName=" + e.srcElement.getAttribute("data-filename")).success(function (data, xhr) {
            console.log("File deleted.", data);
            e.path[2].style.display = "none";
        }).error(function (data, xhr) {
            console.log("Error", data, xhr);
        });
    };
});