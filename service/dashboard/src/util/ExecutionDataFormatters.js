function flattenGraphs(graphs) {
  const flattenedGraphs = graphs.map(graph => ({
    id: graph.id,
    type: graph.tags.graphType,
    scale: graph.tags.graphScale,
    executionId: graph.tags.executionName,
  }));
  return flattenedGraphs;
}

function flattenQuerySpans(querySpanGroups) {
  return querySpanGroups.flat().map(querySpan => ({
    id: querySpan.id,
    parentId: querySpan.parentId,
    name: querySpan.name,
    value: querySpan.tags.query,
    rep: querySpan.tags.repetition,
    duration: querySpan.duration,
  }));
}

function flattenStepSpans(stepSpans, querySpans) {
  const flattenedSpans = stepSpans.map((stepSpan) => {
    const { rep } = querySpans.filter(querySpan => querySpan.id === stepSpan.parentId)[0];
    return {
      id: stepSpan.id,
      parentId: stepSpan.parentId,
      name: stepSpan.name,
      duration: stepSpan.duration,
      order: stepSpan.tags ? stepSpan.tags.childNumber : null,
      timestamp: stepSpan.timestamp,
      rep,
    };
  });
  return flattenedSpans;
}

function attachRepsToChildSpans(childSpans, parentSpans) {
  return childSpans.map((childSpan) => {
    const parentSpan = parentSpans.filter(parent => parent.id === childSpan.parentId)[0];
    return Object.assign({ rep: parentSpan.rep }, childSpan);
  });
}

function addExecutionIdAndScaleToQuerySpan(graphs, querySpans) {
  const querySpansWithExecutionAndScale = querySpans.map((querySpan) => {
    const { executionId, scale } = graphs.filter(graph => graph.id === querySpan.parentId)[0];
    querySpan.executionId = executionId;
    querySpan.scale = scale;
    return querySpan;
  });
  return querySpansWithExecutionAndScale;
}

export default {
  flattenGraphs,
  flattenQuerySpans,
  flattenStepSpans,
  attachRepsToChildSpans,
  addExecutionIdAndScaleToQuerySpan,
};
