
document.addEventListener("DOMContentLoaded", () => {
  d3.json("/cantons.json")
    .then(cantons => {
      d3.csv("/referendum_minarett.csv").then(metaData => {

          const width = 800;
          const height = 600;

          const container = d3.select("#viz");

          const svg = container
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .style("background-color", "red")
              .style("border-radius", "10px");


          const projection = d3.geoAlbers()
              .center([-0.25, 47])
              .rotate([-9, 0, 0])
              .parallels([40, 50])
              .scale(13000);


          const path = d3.geoPath().projection(projection);

            const colorScale = d3.scaleThreshold()
                .domain([30,35,40,45,50,55,60,65,70,100])
                .range(["#d0001b", "#e0513c", "#ee7e5f", "#f7a684", "#fdceaa", "#d0e0af", "#a6c185", "#7da35b", "#538633", "#256900"])

            const tooltip = container.append("div")
                .append("div")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background", "rgba(255, 255, 255, 0.85)")
                .style("padding", "0.2em 1em 0.2em 1em")
                .style("border", "1px solid rgba(0,0,0,1)")
                .style("border-radius", "4px")
                .style("color", "black")
                .style("pointer-events", "none");

            const mycantons = svg
              .selectAll("path")
              .data(cantons.features)
              .enter()
              .append("path")
             // .attr("d", d => path(d))
                .attr("d", d => path(d))
                .on("mouseenter", function(d) {
                    const cantonYesVotes = metaData.find(
                        ja_anteil => ja_anteil.id == d.properties.id
                    );
                    const cantonsMinarett = metaData.find(
                        minarett => minarett.id == d.properties.id
                    );
                    tooltip
                        .classed("tooltip", true)
                        .style("opacity", 1)
                        .html(
                            "<h3>" +
                            d.properties.name +
                            "</h3>" +
                            "<p>" +
                            "Ja-Stimmenanteil: " +
                            "<br>" +
                            cantonYesVotes.ja_anteil + "%" +
                            "</p>" +
                            "<p>" +
                            "Anzahl Minarette: " +
                            "<br>" +
                            cantonsMinarett.minarett +
                            "</p>"
                        );
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
                  const cantonsMetaData = metaData.find(ja_anteil => ja_anteil.id == d.properties.id)

              /*    if(cantonsMetaData.ja_anteil<50) {
                      return "red"
                  }
                  else {
                      return "green"
                  } */
                  return colorScale (cantonsMetaData.ja_anteil)
              })
              .attr("stroke", "black")
              .attr("stroke-width");
        })
    })
})
