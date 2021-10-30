import Widget from '@arcgis/core/widgets/Widget';
import { subclass } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx as jsx, renderable } from "@arcgis/core/widgets/support/Widget";


@subclass('esri.widgets.HelloWorld')
export class HelloWorld extends Widget {

    constructor(params?: {}) {
        super(params);
    }

    render() {
        return (
            <div>HelloWorld!!!</div>
        )
    }
}