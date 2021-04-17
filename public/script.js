function clicked(element, isliked, nbUpvotes) {
  element.firstElementChild.className = isliked
    ? "far fa-thumbs-up fa-lg"
    : "fas fa-thumbs-up fa-lg";
  element.lastElementChild.innerText = isliked ? nbUpvotes - 1 : nbUpvotes + 1;
  //todo : add the feature to re-like an unliked challenge
}

function readfile() {
var data = {};
data.path = '/home/test/pgadmin.txt';
data.ext = '.txt';
console.log(data);
  $.ajax({
    url: '/read_file',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(data) {
      console.log(data);
    }
  });
}
