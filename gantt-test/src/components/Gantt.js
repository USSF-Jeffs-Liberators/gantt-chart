import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import '../codebase/dhtmlxgantt.css';
import './Gantt.css';
 
export default class Gantt extends Component {
    componentDidMount() {
       
        var { tasks } = this.props;

        var textEditor = {type: "text", map_to: "text"}
        var dateEditor = {type: "date", map_to: "start_date", min: new Date(2018, 0, 1), max: new Date(2019, 0, 1)}
        var durationEditor = {type: "number", map_to: "duration", min: 0, max: 100}
        var resourceEditor = {type: "text", map_to: "resource"}

        gantt.config.layout = {
            css: "gantt_container",
            cols: [
                {
                    width:400,
                    min_width: 300,
                    rows:[
                        {view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer"},
                        {view: "scrollbar", id: "gridScroll", group:"horizontal"}
                    ]
                },
                {resizer: true, width: 1},
                {
                    rows:[
                        {view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer"},
                        {view: "scrollbar", id: "scrollHor", group:"horizontal"}
                    ]
                },
                {view: "scrollbar", id: "scrollVer"}
            ]
        }

        gantt.config.columns = [
            {name: "text", tree: true, width: 300, resize: true, editor: textEditor},
            {name: "start_date", align: "center", resize: true, editor: dateEditor},
            {name: "duration", align: "center", resize: true, editor: durationEditor},
            {name: "resource", label: "Resource", align: "center", width: 70, editor: resourceEditor},
            {name: "add", width: 44}
        ];

        gantt.config.grid_width = 450;
        gantt.config.fit_tasks = true;
        // gantt.config.autosize = "xy";
        gantt.config.autosize = "y";
        gantt.config.autoscroll = true;
        gantt.config.scroll_size = 20;
        gantt.init(this.ganttContainer);
        gantt.parse(tasks);

        // alert(JSON.stringify(gantt.serialize()))
    }

    render() {
       return (
           <div
                ref={ (input) => { this.ganttContainer = input } }
                style={ { width: '100%', height: '100%' } }
            ></div>
       );
    }
}