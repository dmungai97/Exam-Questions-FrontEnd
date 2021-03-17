import CustomError from '../helpers/exception';
import i18n from '../i18n';

//see the devserver.proxy settings for how this gets redirected to our dev server
const baseUrl = 'api/';

const buildResponseMessage = codes => {
  let msg = '';
  for (const code of codes) {
    msg += i18n.t(`responseCodes.${code}`) + ' ';
  }
  return msg;
};

const get = async (apiName, mutationName, commit, mapItems) => {
  let data = null;
  try {
    const result = await fetch(`${baseUrl}${apiName}`, {
      method: 'GET',
      credentials: 'include'
    });
    if (result.status == 200) {
      data = await result.json();
      if (mapItems) data = mapItems(data);
      if (commit) commit(mutationName, data);
    }
  } catch (err) {
    throw new CustomError(i18n.t('api.internalError'));
  }
  return data;
};

const del = async (apiName, id, mutationName, commit) => {
  let msg;

  try {
    let url = `${baseUrl}${apiName}`;
    if (id) url += `/${id}`;

    const result = await fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    });
    msg = await result.json();

    if (msg.id) {
      if (commit) commit(mutationName, msg.id);
    } else throw CustomError(buildResponseMessage(msg.responseCodes) || i18n.t('api.defaultError'));
  } catch (err) {
    if (err instanceof CustomError) throw err;
    else throw new CustomError(i18n.t('api.internalError'));
  }
  return msg;
};

const update = async (apiName, obj, mutationName, commit) => {
  let resp;

  try {
    const isAdd = !obj.id;
    const url = `${baseUrl}${apiName}${isAdd ? '' : `/${obj.id}`}`;

    const result = await fetch(url, {
      method: isAdd ? 'POST' : 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
    resp = await result.json();
  } catch (err) {
    throw new CustomError(i18n.t('api.internalError'));
  }

  if (resp.id > 0) {
    obj.id = resp.id;
    if (commit) commit(mutationName, obj);
  } else {
    throw new CustomError(buildResponseMessage(resp.responseCodes) || i18n.t('api.defaultError'));
  }

  return resp;
};

const postFormData = async (apiName, formData) => {
  let resp;

  try {
    const url = `${baseUrl}${apiName}`;

    const result = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    resp = await result.json();
  } catch (err) {
    throw new CustomError(i18n.t('api.internalError'));
  }

  return resp;
};

const fetchAssignmentZip = async obj => {
  try {
    const url = `${baseUrl}assignment/student`;

    const result = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });
    if (result.status == 200) {
      let zip = await result.blob();
      const zipUrl = URL.createObjectURL(zip);

      var a = document.createElement('a');
      a.style = 'display: none';
      a.href = zipUrl;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(zipUrl);
      });
    } else if (result.status == 404) {
      throw new CustomError(i18n.t('api.InvalidCredentials'));
    } else if (result.status == 400) {
      throw new CustomError(i18n.t('api.notAvailable'));
    }
  } catch (err) {
    if (err instanceof CustomError) throw err;
    else throw new CustomError(i18n.t('api.internalError'));
  }
};

export { get, del, update, postFormData, fetchAssignmentZip };
