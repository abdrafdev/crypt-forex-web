'use client';

import { useEffect, useRef, useState } from 'react';
import { CryptoBubbleData } from '@/types';
import * as d3 from 'd3';

interface CryptoBubblesProps {
    data: CryptoBubbleData[];
    width?: number;
    height?: number;
}

export const CryptoBubbles = ({ data, width = 800, height = 500 }: CryptoBubblesProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width, height });
    const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);

    // Simulation state to maintain position data
    const [simulationNodes, setSimulationNodes] = useState<d3.SimulationNodeDatum[]>([]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (svgRef.current) {
                const containerWidth = svgRef.current.parentElement?.clientWidth || width;
                setDimensions({
                    width: containerWidth,
                    height: Math.min(500, containerWidth * 0.6)
                });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [width]);

    // Create and update the visualization
    useEffect(() => {
        if (!svgRef.current || data.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear existing elements

        // Create tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'crypto-bubble-tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background-color', 'white')
            .style('border', '1px solid #ccc')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('box-shadow', '0 2px 5px rgba(0, 0, 0, 0.1)')
            .style('pointer-events', 'none')
            .style('z-index', '100');

        // Set up the force simulation
        const simulation = d3.forceSimulation()
            .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
            .force('charge', d3.forceManyBody().strength(5)) // Reduced strength to prevent too much repulsion
            .force('collide', d3.forceCollide().radius((d: any) => d.size + 2).iterations(2));

        // Map data to nodes
        const nodes = data.map(item => ({
            id: item.id,
            symbol: item.symbol,
            name: item.name,
            size: item.size,
            color: getNodeColor(item),
            marketCap: item.marketCap,
            priceChange24h: item.priceChange24h,
            volume24h: item.volume24h,
            category: item.category,
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height
        }));

        // Add nodes to the simulation
        simulation.nodes(nodes);

        // Create a group for each bubble
        const bubbles = svg.selectAll('.bubble')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'bubble')
            .attr('cursor', 'pointer');

        // Add circle to each group
        bubbles.append('circle')
            .attr('r', (d: any) => d.size)
            .attr('fill', (d: any) => d.color)
            .attr('fill-opacity', 0.7)
            .attr('stroke', (d: any) => d3.rgb(d.color).darker(0.5).toString())
            .attr('stroke-width', 2);

        // Add text to each group
        bubbles.append('text')
            .text((d: any) => d.symbol)
            .attr('text-anchor', 'middle')
            .attr('dy', '.3em')
            .attr('fill', 'white')
            .attr('font-size', (d: any) => Math.min(d.size * 0.5, 14))
            .attr('pointer-events', 'none');

        // Add price change as a label
        bubbles.append('text')
            .text((d: any) => `${d.priceChange24h > 0 ? '+' : ''}${d.priceChange24h.toFixed(2)}%`)
            .attr('text-anchor', 'middle')
            .attr('dy', '1.5em')
            .attr('fill', 'white')
            .attr('font-size', (d: any) => Math.min(d.size * 0.3, 12))
            .attr('pointer-events', 'none');

        // Tooltip interactions
        bubbles
            .on('mouseover', function (this: SVGGElement, event: any, d: any) {
                d3.select(this).select('circle')
                    .transition()
                    .duration(200)
                    .attr('fill-opacity', 0.9)
                    .attr('r', d.size * 1.1);

                tooltip
                    .style('visibility', 'visible')
                    .html(`
            <div>
              <div class="font-bold">${d.name} (${d.symbol})</div>
              <div>Market Cap: $${formatNumber(d.marketCap)}</div>
              <div>24h Change: <span style="color: ${d.priceChange24h > 0 ? 'green' : 'red'}">${d.priceChange24h > 0 ? '+' : ''}${d.priceChange24h.toFixed(2)}%</span></div>
              <div>Volume: $${formatNumber(d.volume24h)}</div>
              <div>Category: ${d.category}</div>
            </div>
          `);
                setHoveredBubble(d.id);
            })
            .on('mousemove', function (event: { pageY: number; pageX: number; }) {
                tooltip
                    .style('top', (event.pageY - 10) + 'px')
                    .style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', function (this: SVGGElement, event: any, d: any) {
                d3.select(this).select('circle')
                    .transition()
                    .duration(200)
                    .attr('fill-opacity', 0.7)
                    .attr('r', d.size);

                tooltip.style('visibility', 'hidden');
                setHoveredBubble(null);
            });

        // Add drag behavior
        const drag = d3.drag<SVGGElement, any>()
            .on('start', (event: { active: any; sourceEvent: { currentTarget: any; }; }, d: { fx: any; x: any; fy: any; y: any; }) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                d3.select(event.sourceEvent.currentTarget).select('circle')
                    .attr('fill-opacity', 0.9)
                    .attr('stroke-width', 3);
            })
            .on('drag', (event: { x: any; y: any; }, d: { fx: any; fy: any; }) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event: { active: any; sourceEvent: { currentTarget: any; }; }, d: { fx: null; fy: null; }) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
                d3.select(event.sourceEvent.currentTarget).select('circle')
                    .attr('fill-opacity', 0.7)
                    .attr('stroke-width', 2);
            });

        // Apply drag behavior to bubbles
        bubbles.call(drag);

        // Update positions on each tick
        simulation.on('tick', () => {
            bubbles.attr('transform', (d: any) => {
                // Keep bubbles within bounds
                d.x = Math.max(d.size, Math.min(dimensions.width - d.size, d.x));
                d.y = Math.max(d.size, Math.min(dimensions.height - d.size, d.y));
                return `translate(${d.x},${d.y})`;
            });
        });

        // Update simulation nodes state for reference
        setSimulationNodes(nodes);

        // Cleanup on unmount
        return () => {
            simulation.stop();
            tooltip.remove();
        };
    }, [data, dimensions]);

    // Helper function to format large numbers
    const formatNumber = (value: number): string => {
        if (value >= 1e9) {
            return `${(value / 1e9).toFixed(2)}B`;
        } else if (value >= 1e6) {
            return `${(value / 1e6).toFixed(2)}M`;
        } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(2)}K`;
        } else {
            return value.toString();
        }
    };

    // Function to determine bubble color based on price change and category
    const getNodeColor = (node: CryptoBubbleData): string => {
        // Base color by category
        const baseColor = node.category === 'stablecoin' ? '#3b82f6' : '#8b5cf6';

        // Adjust color based on price change
        if (Math.abs(node.priceChange24h) < 0.1) {
            return baseColor; // Neutral - minimal change
        } else if (node.priceChange24h > 0) {
            return '#34d399'; // Green for positive
        } else {
            return '#f87171'; // Red for negative
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="mb-4">
                <h3 className="text-xl font-medium text-gray-900">Crypto Market Bubbles</h3>
                <p className="text-gray-500 text-sm">
                    Visualize stablecoins and forex pairs by market cap and performance
                </p>
            </div>
            <div className="relative" style={{ height: `${dimensions.height}px` }}>
                <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="bg-gray-50 rounded-lg"></svg>

                {/* Legend */}
                <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-sm font-medium mb-2">Legend</p>
                    <div className="flex items-center mb-1">
                        <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                        <span className="text-xs text-gray-600">Positive change</span>
                    </div>
                    <div className="flex items-center mb-1">
                        <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                        <span className="text-xs text-gray-600">Negative change</span>
                    </div>
                    <div className="flex items-center mb-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-xs text-gray-600">Stablecoins</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span className="text-xs text-gray-600">Forex pairs</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Size = Market Cap</p>
                    <p className="text-xs text-gray-500 italic mt-1">Drag bubbles to move them</p>
                </div>
            </div>
        </div>
    );
};

// Market List component
export const MarketList = ({ data }: { data: CryptoBubbleData[] }) => {
    // Sort data by market cap
    const sortedData = [...data].sort((a, b) => b.marketCap - a.marketCap);

    return (
        <div className="bg-white rounded-lg border border-gray-200 h-full">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-xl font-medium text-gray-900">Market List</h3>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '450px' }}>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price Change</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                        <div>
                                            <div className="font-medium text-gray-900">{item.symbol}</div>
                                            <div className="text-xs text-gray-500">{item.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${item.priceChange24h > 0 ? 'text-green-600' : item.priceChange24h < 0 ? 'text-red-600' : 'text-gray-500'
                                    }`}>
                                    {item.priceChange24h > 0 && '+'}
                                    {item.priceChange24h.toFixed(2)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                    ${(item.marketCap / 1000000).toFixed(1)}M
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};