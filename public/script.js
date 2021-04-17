
function clicked(element, isliked, nbUpvotes) {
  if(isliked){
    let newValue = "clicked(this, false,"+ (nbUpvotes - 1) + ")";
    element.setAttribute("onclick", newValue);
    element.firstElementChild.className = "far fa-thumbs-up fa-lg";
    element.lastElementChild.innerText = nbUpvotes - 1;
    upvote(element["id"].substring(10), true)
  }else{
    let newValue = "clicked(this, true,"+ (nbUpvotes + 1) + ")"
    element.setAttribute("onclick" ,newValue);
    element.firstElementChild.className = "fas fa-thumbs-up fa-lg";
    element.lastElementChild.innerText = nbUpvotes + 1;
    upvote(element["id"].substring(10), false)
  }
}

function upvote(challengeid, isLiked) {
  var data = {};
  data.challengeid = challengeid;
  data.isLiked = isLiked;
  $.ajax({
    url: '/upvote',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data)
  });
}
