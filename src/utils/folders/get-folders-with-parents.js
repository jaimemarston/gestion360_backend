import { Folders } from '../../models/index.js';

async function getFolderWithParents(id) {
    let folder = await Folders.findByPk(id);
    if (!folder) {
      return null;
    }

    let parents = [];
    let currentParentId = folder.parent;

    while (currentParentId) {
        let parentFolder = await Folders.findByPk(currentParentId);
        if (!parentFolder) {
            break;
        }
        parents.push(parentFolder);
        currentParentId = parentFolder.parent;
    }

    folder.dataValues.parents = parents;
    return folder;
}

export { getFolderWithParents }
