import * as React from 'react'
import { css, StyleSheet } from 'aphrodite'

import loadGraph from '../../graph/loader'
import Renderer from '../../graph/renderer'
import { Graph, GraphNode } from '../../utils/types'

import config from '../../config'

const styles = StyleSheet.create({
    graphContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        overflow: 'hidden',
        background: 'black'
    }
})
interface GalaxyProps {
    graphId: string
    onNodeClik: (e: any, node: GraphNode) => any
}

interface GalaxyState {
    graphId: string
}
class Galaxy extends React.Component<GalaxyProps, GalaxyState> {
    container: HTMLDivElement
    renderer: Renderer

    constructor(props: GalaxyProps) {
        super(props)
        this.state = {
            graphId: props.graphId
        }
        this.renderGraph = this.renderGraph.bind(this)
        this.stopRotation = this.stopRotation.bind(this)
    }

    componentDidMount() {
        setTimeout(() => {
            this.renderer = new Renderer(this.container)
            this.renderGraph(this.props.graphId)
        }, 1)
    }

    componentWillReceiveProps(newProps: GalaxyProps) {
        if (newProps.graphId !== this.props.graphId) {
            this.setState({
                graphId: newProps.graphId
            })
            this.renderGraph(newProps.graphId)
        }
    }

    renderGraph(graphId: string) {
        loadGraph(graphId).then((graph: Graph) => {
            this.renderer.reset()
            const { pos, lookAt } = config.camera
            this.renderer.configCamera({
                pos,
                lookAt
            })
            this.renderer.configHitTest({
                onOver: (e: any, node: GraphNode) => {},
                onClick: this._handleClick
            })
            this.renderer.render(graph)
        })
    }

    _handleClick = (e: any, node: GraphNode) => {
        const { id, label } = node
        this.props.onNodeClik(e, node)
    }

    stopRotation() {
        this.renderer.setCameraRotate(false)
    }

    focus() {
        this.container.focus()
    }

    render() {
        return (
            <div
                className={css(styles.graphContainer)}
                ref={(ref: HTMLDivElement) => (this.container = ref)}
                onClick={this.stopRotation}
            />
        )
    }
}

export default Galaxy