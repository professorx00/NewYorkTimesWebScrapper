$(".saveBtn").on("submit",(event)=>{
  console.log("click save button")
  const target = $(event.target);
  const body = {
    title:target.attr("data-title"),
    link:target.attr("data-link")
  }
  $.post('/savearticle',body,(err,data)=>{
    if(err) throw err
    console.log("sent data" + data)
  })
})