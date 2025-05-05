const { singleDB, DB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');
// CREATE

const createLanding = async (pageData) => {
    try {
        const query = `INSERT INTO landings SET ?`;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const createSlide = async (slideData) => {
    try {
        slideData.type = 'slider';
        slideData.isSelected = 0;
        const query = `INSERT INTO slider SET ?`;
        const response = await DB(query, slideData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const updateSlidesSelectionVaried = async (updates = []) => {
    try {
      if (!Array.isArray(updates) || updates.length === 0) {
        throw new Error('Must provide an array of { sliderID, selected }');
      }
  
      // Build the CASE clauses: "WHEN ? THEN ?"
      const caseClauses = updates.map(() => `WHEN ? THEN ?`).join(' ');
  
      // Collect params for the CASE: [id1, sel1, id2, sel2, ...]
      // coerce boolean to 1/0
      const caseParams = updates.flatMap(u => [
        u.sliderID,
        u.selected ? 1 : 0
      ]);
  
      // Build the IN-list placeholders and params
      const inPlaceholders = updates.map(() => `?`).join(', ');
      const inParams = updates.map(u => u.sliderID);
  
      const sql = `
        UPDATE slider
        SET isSelected = CASE sliderID
          ${caseClauses}
          ELSE isSelected
        END
        WHERE sliderID IN (${inPlaceholders})
      `;
  
      const params = [...caseParams, ...inParams];
      const response = await DB(sql, params);
  
      return {
        status: Number(response.affectedRows > 0),
        updatedCount: response.affectedRows
      };
    } catch (error) {
      logger.log({
        level: 'error',
        message: error.stack,
        inputs: [...arguments][0]
      });
      return { status: 0, error };
    }
};
  
const createStatic = async (staticData) => {
    try {
        staticData.type = 'static';
        const query = `INSERT INTO slider SET ?`;
        const response = await DB(query, staticData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const updateStaticImage = async (staticData) => {
    try {
        // Ensure the staticData contains the necessary ID and image URL
        if (!staticData.sliderID || !staticData.sliderImage) {
            return { status: 0, message: 'ID and image URL are required' };
        }

        // Update the image URL for the existing static entry
        const query = `UPDATE slider SET sliderImage = ? WHERE sliderID = ?`;
        const response = await DB(query, [staticData.sliderImage, staticData.sliderID]);

        // Check if the update was successful
        const status = Number(response.affectedRows && response.affectedRows === 1);
        if (status) {
            return { status: 1, message: 'Image URL updated successfully.' };
        } else {
            return { status: 0, message: 'No rows updated. Please check the ID.' };
        }
    } catch (error) {
        logger.log({'level':'error','message': error.stack, 'inputs': [...arguments][0] });
        return { status: 0, error };
    }
};


const updateStaticsSelectionVaried = async (updates = []) => {
    try {
      if (!Array.isArray(updates) || updates.length === 0) {
        throw new Error('Must provide an array of { sliderID, selected }');
      }
  
      // Build the CASE clauses: "WHEN ? THEN ?"
      const caseClauses = updates.map(() => `WHEN ? THEN ?`).join(' ');
  
      // Collect params for the CASE: [id1, sel1, id2, sel2, ...]
      // coerce boolean to 1/0
      const caseParams = updates.flatMap(u => [
        u.sliderID,
        u.selected === undefined ? 0 : u.selected
      ]);
  
      // Build the IN-list placeholders and params
      const inPlaceholders = updates.map(() => `?`).join(', ');
      const inParams = updates.map(u => u.sliderID);
  
      const sql = `
        UPDATE slider
        SET isSelected = CASE sliderID
          ${caseClauses}
          ELSE isSelected
        END
        WHERE sliderID IN (${inPlaceholders})
      `;
  
      const params = [...caseParams, ...inParams];
      const response = await DB(sql, params);
  
      return {
        status: Number(response.affectedRows > 0),
        updatedCount: response.affectedRows
      };
    } catch (error) {
      logger.log({
        level: 'error',
        message: error.stack,
        inputs: [...arguments][0]
      });
      return { status: 0, error };
    }
};

const createTrendingVideo = async (videoData) => {
    try {
        const query = `INSERT INTO trendingVideos SET ?`;
        const response = await DB(query, videoData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
}

// REQUEST

const requestLandings = async () => {
    try {
        const query = `SELECT landingID, pageURL, pageTitle, landingImage FROM landings`;
        return { landings: await DB(query) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestLanding = async (searchParam, isURL = true) => {
    try {
        const query = `SELECT * FROM landings LEFT JOIN google_locations ON landings.googleBusinessId = google_locations.id WHERE ?? = ?`;
        const data = (isURL) ? [`pageURL`, searchParam] : [`landingID`, searchParam];
        return { page: await singleDB(query, data) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestSlider = async () => {
    try {
        const query = `SELECT * FROM slider WHERE type = 'slider' ORDER BY position`;
        // const query = `SELECT * FROM slider ORDER BY position`;

        return { slider: await DB(query) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestSelectedSlider = async () => {
    try {
        const query = `SELECT * FROM slider WHERE type = 'slider' AND isSelected = 1 ORDER BY position`;
        // const query = `SELECT * FROM slider ORDER BY position`;

        return { selectedSlider: await DB(query) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestStatic = async () => {
    try {
        const query = `SELECT * FROM slider WHERE type = 'static' ORDER BY position`;
        // const query = `SELECT * FROM slider ORDER BY position`;

        return { static: await DB(query) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestSelectedStatic = async () => {
    try {
        const query = `SELECT * FROM slider WHERE type = 'static' AND isSelected != 0 ORDER BY position`;
        // const query = `SELECT * FROM slider ORDER BY position`;

        return { selectedStatic: await DB(query) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestTrendingVideo = async () => {
    try {
        const query = `SELECT * FROM trendingVideos`;
        return { trendingVideo: await singleDB(query) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

// UPDATE

const updateLanding = async ({ landingID, ...updateData }) => {
    try {
        const query = `UPDATE landings SET ? WHERE landingID = ?`;
        const response = await DB(query, [updateData, landingID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(landingID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const updateLandingPortfolioRelations = async ({ landingID, portfolioIdsArray }) => {
    try {
        await DB(`DELETE FROM landings_portfolio_relationship WHERE landing_id = ?`,[landingID]);
        let status = 1;
        for (let portfolioId of portfolioIdsArray) {
            const query = `Insert into landings_portfolio_relationship (landing_id, portfolio_id) values (? , ?);`;
            const response = await DB(query, [landingID, portfolioId.trim()]);
        }

        return { status, requestID: Number(landingID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const updateSlide = async ({ sliderID, ...updateData }) => {
    try {
        const query = `UPDATE slider SET ? WHERE sliderID = ? AND type = 'slider'`;
        // const query = `UPDATE slider SET ? WHERE sliderID = ?`;

        const response = await DB(query, [updateData, sliderID]);
        const { sliderImage } = updateData;
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(sliderID), sliderImage };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const updateStatic = async ({ staticID, ...updateData }) => {
    try {
        const query = `UPDATE slider SET ? WHERE sliderID = ? AND type = 'static'`;
        // const query = `UPDATE slider SET ? WHERE sliderID = ?`;

        const response = await DB(query, [updateData, staticID]);
        const { staticImage } = updateData;
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { sliderImage: updateData?.sliderImage, sliderID: Number(staticID), staticImage };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const updatePositions = async (requestData) => {
    try {
        const promises = [];
        for (const sliderID in requestData) {
            const updateData = { position: requestData[sliderID] };
            const query = `UPDATE slider SET ? WHERE sliderID = ?`;
            promises.push(DB(query, [updateData, sliderID]))
        }
        await Promise.all(promises);
        return { status: 1 };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const updateStaticPositions = async (requestData) => {
    try {
        const promises = [];
        for (const staticID in requestData) {
            const updateData = { position: requestData[staticID] };
            const query = `UPDATE slider SET ? WHERE sliderID = ?`;
            promises.push(DB(query, [updateData, staticID]))
        }
        await Promise.all(promises);
        return { status: 1 };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const updateTrendingVideo = async ({ videoID = 1, ...updateData }) => {
    try {
        const query = `UPDATE trendingVideos SET ?`;
        const response = await DB(query, [updateData, videoID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(videoID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
}

// DELETE

const deleteLanding = async (landingID) => {
    try {
        const lprQuery = `DELETE FROM landings_portfolio_relationship WHERE landing_id = ?`;
        const lprResponse = await DB(lprQuery, [landingID]);
        const landingsQuery = `DELETE FROM landings WHERE landingID = ?`;
        const landingsResponse = await DB(landingsQuery, [landingID]);
        const status = Number(landingsResponse.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(landingID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const deleteSlide = async (sliderID) => {
    try {
        const query = `DELETE FROM slider WHERE sliderID = ?`;
        const response = await DB(query, [sliderID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(sliderID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const deleteStatic = async (staticID) => {
    try {
        const query = `DELETE FROM slider WHERE sliderID = ?`;
        const response = await DB(query, [staticID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(staticID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

module.exports = {
    createLanding, createSlide, updateSlidesSelectionVaried, updateStaticsSelectionVaried, createStatic, createTrendingVideo, requestLandings, requestLanding, requestSlider, requestSelectedSlider, requestStatic, requestTrendingVideo,
    updateLanding, updateSlide, updateStatic, updatePositions, updateStaticPositions, updateTrendingVideo, deleteLanding, deleteSlide, deleteStatic, updateLandingPortfolioRelations
};