import React from 'react';
import { createPopper } from '@popperjs/core';
import { useSelector } from 'react-redux';

import { useActionDispatch } from '../../../hooks';
import { getLocaleObject, postLocaleObject, setObject } from '../../../redux/actions/object';
import { setLocData } from '../../../redux/actions/tasks-actions';

const OBJECT_TOOLTIPS = 'tooltips';
const OBJECT_TOOLTIPS_PREFERENCE = 'tooltippreference';
let targetName = '';
let placeRef = '';
let tipRef = '';
let tipStateRef = '';
let tooltipsRef = {};
let isTipsLoaded = false;
let scheduledTip = false;
let resolveOnGotIt;
let instance;
const ReactTooltip = {
  show: (ref) => {
    const tip = document.querySelector('#popover');
    tip.style.visibility = 'visible';
    instance = createPopper(ref, tip, { modifiers: [{ name: 'offset', options: { offset: [0, 10]}}] });
    tipStateRef(true);
  },
  hide: () => {
    tipStateRef(false);
    instance && instance.destroy && (instance.destroy());
    instance = null;
    const tip = document.querySelector('#popover');
    tip.style.visibility = 'hidden';
  },
};

const Tooltip = () => {
  tipRef = React.useRef(null);
  const [tipSate, setTipState] = React.useState(null);
  tipStateRef = setTipState;

  const getAllTooltips = useActionDispatch(getLocaleObject(OBJECT_TOOLTIPS, undefined, undefined));
  const getTooltipPref = useActionDispatch(getLocaleObject(OBJECT_TOOLTIPS_PREFERENCE, undefined, undefined));
  const postTooltipPref = useActionDispatch(postLocaleObject(OBJECT_TOOLTIPS_PREFERENCE, undefined, undefined));
  const setTooltips = useActionDispatch(setObject(OBJECT_TOOLTIPS));
  const tooltips = useSelector(state => state.tooltips?.data);
  const updateLocStatus = useActionDispatch(setLocData);
  const locStatusData = useSelector(state => state.tasksActions?.data);
  tooltipsRef = tooltips;

  const markAsRead = (target) => {
    tooltips[target] = null;
    setTooltips(tooltips);
    const data = { toolTips: [{ toolTip: target, display: false }] };
    postTooltipPref(data);
    const viewedTipsMap = locStatusData.viewedTipsMap || {};
    viewedTipsMap[target] = true;
    updateLocStatus({ viewedTipsMap });
  };

  React.useEffect(() => {
    if (!Object.keys(tooltips).length) {
      Promise.all([getAllTooltips(), getTooltipPref()]).then((data) => {
        const tooltips = {};
        const allTips = data[0] && data[0].data ? data[0].data : [];
        const viewedTips = data[1] && data[1].toolTips ? data[1].toolTips : [];
        const viewedTipsMap = {};
        viewedTips.forEach(({toolTip}) => {
          viewedTipsMap[toolTip] = true;
        });
        updateLocStatus({ viewedTipsMap });

        for(let i = 0; i < allTips.length; i++) {
          const tipKey = allTips[i][0];
          const tipData = allTips[i][1];
          const isViewedTip = viewedTipsMap[tipKey];
          if (!isViewedTip) {
            tooltips[tipKey] = tipData;
          }
        }
        setTooltips(tooltips);
        isTipsLoaded = true;
        if (scheduledTip) {
          Tooltip.show(scheduledTip, placeRef, true);
          scheduledTip = false;
        }
      }, () => {});
    }
  }, []);

  const onClick = e => {
    if (tipRef.current && !tipRef.current.contains(e.target)) {
      Tooltip.hide();
    }
  };
  React.useEffect(() => {
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);

  React.useEffect(() => {
    instance && instance.update && (instance.update());
  }, [tipSate]);

  return (
    <div
      className="popover shadow bg-primary fade show bs-popover-auto"
      role="tooltip"
      id="popover"
      style={{visibility: 'hidden'}}
      ref={tipRef}
    >
      <div data-popper-arrow className="arrow"></div>
      <div className="popover-body lead text-white" dangerouslySetInnerHTML={{__html: tooltips[targetName]}}></div>
      <div className="px-3 pb-3 text-right lead">
        <a
          href="#"
          className="text-light font-weight-bold dismiss text-light-popper"
          onClick={() => {
            markAsRead(targetName);
            resolveOnGotIt('resolved');
            Tooltip.hide();
          }}
        >
          GOT IT
        </a>
      </div>
    </div>
  );
};

Tooltip.show = (target, place, isScheduled) => {
  if (!isTipsLoaded) {
    scheduledTip = target;
    placeRef = place || 'top';
    return new Promise((resolve) => { resolveOnGotIt = resolve; });
  }
  if (!tooltipsRef[target]) {
    return new Promise((r) => {r;});
  }
  setTimeout(() => {
    targetName = target;
    placeRef = place || 'top';
    const ele = document.querySelector('.' + target);
    if (ele) {
      ele.setAttribute('data-tip', 'ReactTooltip');
      ReactTooltip.show(ele);
    }
  }, 1000);
  if (!isScheduled) {
    return new Promise((resolve) => { resolveOnGotIt = resolve; });
  }
};

Tooltip.hide = () => {
  ReactTooltip.hide();
};

Tooltip.displayName = 'Tooltip';
export default Tooltip;
