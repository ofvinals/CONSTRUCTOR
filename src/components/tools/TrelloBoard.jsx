import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Función para reordenar elementos dentro de una columna
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Función para mover elementos entre columnas
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  return {
    source: sourceClone,
    destination: destClone,
  };
};

const TrelloBoard = () => {
  const [columns, setColumns] = useState({
    'column-1': {
      id: 'column-1',
      title: 'Obra 1',
      items: ['tool-1', 'tool-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Obra 2',
      items: ['tool-3'],
    },
  });

  const [tools] = useState({
    'tool-1': { id: 'tool-1', content: 'Martillo' },
    'tool-2': { id: 'tool-2', content: 'Destornillador' },
    'tool-3': { id: 'tool-3', content: 'Alicates' },
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Si no hay un destino válido, salimos
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const newItems = reorder(
        column.items,
        source.index,
        destination.index
      );
      const newColumn = { ...column, items: newItems };
      setColumns({ ...columns, [newColumn.id]: newColumn });
    } else {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const result = move(
        sourceColumn.items,
        destColumn.items,
        source,
        destination
      );

      const newSourceColumn = { ...sourceColumn, items: result.source };
      const newDestColumn = { ...destColumn, items: result.destination };

      setColumns({
        ...columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', overflowX: 'auto', padding: '8px' }}>
        {Object.values(columns).map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  padding: 8,
                  width: 300,
                  minHeight: 500,
                  margin: '0 8px',
                  border: '1px solid lightgrey',
                  borderRadius: 4,
                  backgroundColor: '#f4f5f7',
                }}
              >
                <h3
                  style={{
                    padding: '8px 0',
                    textAlign: 'center',
                    backgroundColor: '#e2e4e6',
                    borderBottom: '1px solid lightgrey',
                  }}
                >
                  {column.title}
                </h3>
                {column.items.map((itemId, index) => {
                  const item = tools[itemId];
                  if (!item) {
                    console.error(`Item with ID ${itemId} not found in tools`);
                    return null;
                  }
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: 16,
                            margin: '0 0 8px 0',
                            minHeight: '50px',
                            backgroundColor: '#ffffff',
                            color: '#333',
                            border: '1px solid lightgrey',
                            borderRadius: 4,
                            ...provided.draggableProps.style,
                          }}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TrelloBoard;
