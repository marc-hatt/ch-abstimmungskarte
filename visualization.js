
document.addEventListener("DOMContentLoaded", () => {
  d3.json("/cantons.json")
    .then(cantons => {
      d3.csv("/referendum.csv")
        .then(yesVotes => {
        console.log(cantons)

          const width = 800;
          const height = 600;

          const container = d3.select("#viz");

          const svg = container
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .style("background-color", "white");

          const projection = d3.geoAlbers()
              .center([0, 46.7])
              .rotate([-9, 0, 0])
              .parallels([40, 50])
              .scale(12000);

          const path = d3.geoPath().projection(projection);

            const colorScale = d3.scaleThreshold()
                .domain([30,35,40,45,50,55,60,65,70,100])
                .range(["#d0001b", "#e0513c", "#ee7e5f", "#f7a684", "#fdceaa", "#d0e0af", "#a6c185", "#7da35b", "#538633", "#256900"])

            const tooltip = container.append("div")
                .style("opacity", 0.3)
                .style("position", "fixed")
                .style("background", "rgba(255,255,255,0.8)")
                .style("padding", "0.8rem")
                .style("pointer-events", "none")

            const mycantons = svg
              .selectAll("path")
              .data(cantons.features)
              .enter()
              .append("path")
             // .attr("d", d => path(d))
                .attr("d", d => path(d))
                .on("mouseenter", function(d) {
                    tooltip
                        .style("opacity", 1)
                        .html(d.properties.name) + (d.properties.ja_anteil);
                })
                .on("mousemove", function(){
                    tooltip
                        .style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY + "px")
                })
                .on("mouseleave", function(){
                    tooltip.style("opacity", 0)
                })

              .attr("fill", function(d) {
                  const cantonsMetaData = yesVotes.find(ja_anteil => ja_anteil.id == d.properties.id)

                  console.log(cantonsMetaData)
              /*    if(cantonsMetaData.ja_anteil<50) {
                      return "red"
                  }
                  else {
                      return "green"
                  } */
                  return colorScale (cantonsMetaData.ja_anteil)
              })
              .attr("stroke", "rgba(255,255,255,0.5")
              .attr("stroke-width");


        })
    })
})
