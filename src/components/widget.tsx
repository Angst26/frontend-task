import React, { useState} from "react";
import * as THREE from "three";
import {useBehaviorSubject, useViewer} from "../hooks";
import PropertiesViewerWidget from "./PropertiesWidget.tsx";
import styled from "styled-components";

interface HierarchyNodeProps {
    object: THREE.Object3D;
    onSelect: (object: THREE.Object3D) => void;
    level?: number;
}

const Div = styled.div`
    position: absolute;
    color: #242424;
    background-color: aliceblue;
    top: 10px;
    right: 10px;
    padding: 10px;
    maxHeight: 90vh;
    overflowY: auto;
    border: 1px solid #ccc;
`

const HierarchyNode: React.FC<HierarchyNodeProps> = ({ object, onSelect, level = 0 }) => {
    const [expanded, setExpanded] = useState(true);


    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(object);
    };

    return (
        <div style={{ marginLeft: level * 16, userSelect: "none" }}>
            <div
                style={{ cursor: "pointer", padding: "2px 4px", border: "1px solid transparent" }}
                onClick={handleClick}
                onDoubleClick={() => setExpanded(!expanded)}
            >
                {object.name || object.type}
            </div>
            {expanded &&
                object.children.map((child) => (
                    <HierarchyNode key={child.uuid} object={child} onSelect={onSelect} level={level + 1} />
                ))}
        </div>
    );
};


export const Widget: React.FC = () => {
    const viewer = useViewer();
    const model = useBehaviorSubject<THREE.Object3D | null>(viewer.model.modelSubject);

    const handleSelect = (object: THREE.Object3D) => {
        if (!viewer) return;
        console.log('выбран объект: ', object);
        if (typeof viewer.highlightObject === "function") {
            console.log('меняем цвет объекту ', object);
            viewer.highlightObject(object);
        }
    };


    if (!viewer) return <Div >
        Загрузка виджета...
    </Div>;
    if(!model) return <Div>Загрузка модели...</Div>

    return (
        <Div
            style={{
                zIndex: 1000,
            }}
        >
            <h3>Иерархия объектов</h3>
            <HierarchyNode object={model} onSelect={handleSelect} />
            <PropertiesViewerWidget viewer={viewer} model={model}></PropertiesViewerWidget>
        </Div>
    );
};