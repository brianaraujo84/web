import React from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Layout from '../../shared/layout';
import Content from './content';
import ZoneTasks from './zone-tasks';
import CustomJobTasks from './custom-job-tasks';
import { TextUtils } from '../../../utils';

import { useTitle, useActionDispatch } from '../../../hooks';
import { postConfidenceObject, getStandardObject, setObject } from '../../../redux/actions/object';
import GroupLoader from './group-loader';

const OBJECT_TEMPLATE = 'template';
const OBJECT_LOСATION = 'location';

const TaskDetails = () => {
  const { t } = useTranslation();
  useTitle(t('task_details'));
  const history = useHistory();
  const { taskTemplateId, tm, locationId } = useParams();
  const { search = '' } = useLocation();
  const { type } = TextUtils.getQueryParams(search);


  const newTaskData = history.location && history.location.state && history.location.state.newTaskData;

  const getTemplateInfo = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE, undefined, 'template/details'));
  const getLocation = useActionDispatch(getStandardObject(OBJECT_LOСATION, undefined, undefined, '/summary'));
  const groupMenuUpdate = useActionDispatch(setObject('groupMenuUpdate'));
  const checkTemplateAvailability = useActionDispatch(postConfidenceObject('marketplace/template'));

  const [allCustomeJobReviewsInListCompleted, setAllCustomeJobReviewsInListCompleted] = React.useState(false);
  const [numberofCustomTasksReviewed, setNumberofCustomTasksReviewed] = React.useState(0);
  const [numberofCustomTasksToReview, setnumberofCustomTasksToReview] = React.useState(0);
  const [customJobCompleted, setCustomJobCompleted] = React.useState(false);
  const [simplifiedMode, setSimplifiedMode] = React.useState(false);

  const [getTemplateInfoData, setGetTemplateInfoData] = React.useState({});
  const [areTemplatesAvailable, setAreTemplatesAvailable] = React.useState(false);

  const {
    initialLoading,
    data: { locationUserRole, locationType },
    data: loc,
  } = useSelector((state) => state.loc);

  const getTemplateDetails = async () => {
    const responce = await getTemplateInfo({ templateId: taskTemplateId });
    if (responce) {
      setGetTemplateInfoData(responce.templateDetails);
    }
  };

  const handleViewChange = (val) => {
    setSimplifiedMode(val !== 'Card');
  };

  const updateSideGroupList = () => {
    groupMenuUpdate({update: true});
    setTimeout(() => {
      groupMenuUpdate({update: undefined});
    },500);
  };

  const updateTemplateData = (data) => {
    setGetTemplateInfoData(data);
  };

  const checkLocationType = async () => {
    const res = await checkTemplateAvailability({
      templateType: 'Reference',
      locationType
    });
    if (res?.templates?.length > 0) {
      setAreTemplatesAvailable(true);
    } else {
      setAreTemplatesAvailable(false);
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [taskTemplateId, tm]);

  React.useMemo(() => {
    if (history.location?.state?.templateId || taskTemplateId) {
      getTemplateDetails();
    }
  },[history.location?.state?.templateId, taskTemplateId]);

  React.useEffect(() => {
    if (getTemplateInfoData?.templateType === 'Custom' && getTemplateInfoData?.numberofTasks) {
      setnumberofCustomTasksToReview(getTemplateInfoData.numberofTasks);
    }
  },[getTemplateInfoData]);

  React.useEffect(() => {
    if (type !== 'Main') {
      getTemplateDetails();
    } else {
      setGetTemplateInfoData({ templateType: type });
    }
    getLocation(locationId);
  },[]);

  React.useMemo(() =>{
    checkLocationType();
  },[locationType]);

  const loading = useSelector(state => {
    return !state.tasks || state.tasks.initialLoading
      || !state.customJobs || state.customJobs.initialLoading || initialLoading || !getTemplateInfoData || (!Object.keys(state.templateTasks.data).length && getTemplateInfoData?.templateType === 'Main');
  });

  return (
    <Layout>
      <div className='content-wrapper'>
        <Content task={getTemplateInfoData} isLoading={loading} updateTasks={getTemplateDetails}
          allCustomeJobReviewsInListCompleted={allCustomeJobReviewsInListCompleted}
          setCustomJobCompleted={setCustomJobCompleted}
          locationUserRole={locationUserRole}
          simplifiedMode={simplifiedMode}
          my={locationUserRole === 'Member'}
          isOwnerManager={locationUserRole === 'Owner' || locationUserRole === 'Manager'}
        />
        {getTemplateInfoData?.templateType !== 'Custom' && getTemplateInfoData?.templateType !== 'Main' && <GroupLoader />}
        {getTemplateInfoData?.templateType === 'Custom' && <CustomJobTasks
          newTaskData = {newTaskData}
          editable={locationUserRole === 'Owner' || locationUserRole === 'Manager'}
          taskSummary={getTemplateInfoData}
          isLoading={loading}
          setAllCustomeJobReviewsInListCompleted={setAllCustomeJobReviewsInListCompleted}
          setNumberofCustomTasksReviewed={setNumberofCustomTasksReviewed}
          numberofCustomTasksReviewed={numberofCustomTasksReviewed}
          numberofCustomTasksToReview={numberofCustomTasksToReview}
          customJobCompleted={customJobCompleted}
          locationUserRole={locationUserRole}
          simplifiedMode={simplifiedMode}
          loc={loc}
          my={locationUserRole === 'Member'}
          updateSideGroupList={updateSideGroupList}
          handleViewChange={handleViewChange}
          areTemplatesAvailable={areTemplatesAvailable}
        />
        }
        {(getTemplateInfoData?.templateType === 'Main') && <ZoneTasks isOwnerOrManager={locationUserRole === 'Owner' || locationUserRole === 'Manager'} updateTemplateData={updateTemplateData} taskSummary={getTemplateInfoData} isLoading={loading} />}
      </div>
    </Layout>
  );
};

TaskDetails.displayName = 'TaskDetails';
export default TaskDetails;
