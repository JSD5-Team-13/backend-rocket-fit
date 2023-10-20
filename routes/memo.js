const express = require ('express');
const router = express.Router();
const Memo = require ('../models/calendar.js');

router.get('/' , async (req , res) => {
    try {
        const listMemo = await Memo.find(req.params)
        res.status(200).json(listMemo);
    } catch (error) {
        console.log("Get memo error" , error);
        res.status(500).json({ error : 'Get memo error'});
    }
});

router.get('/:id' , async (req , res) => {
    try {
        const listMemo = await Memo.findById(req.params.id)
        res.status(200).json(listMemo);
    } catch (error) {
        console.log("Get memo error" , error);
        res.status(500).json({ error : 'Get memo error'});
    }
});

router.post('/', async (req , res) => {
    try {
        const memoData = req.body;
        const memo = await Memo.create({
            ...memoData
        });
        res.status(200).json(memo);
    } catch (error) {
        console.log("Get memo error" , error);
        res.status(500).json({ error : 'Get memo error'});
    }
})

router.put('/:id', async (req, res) => {
    try {
      const memoData = req.body;
      const updatedMemo = await Memo.findByIdAndUpdate(req.params.id, memoData, { new: true });
  
      if (!updatedMemo) {
        return res.status(404).json({ error: 'Memo not found' });
      }
  
      res.status(200).json(updatedMemo);
    } catch (error) {
      console.error("Update memo error", error);
      res.status(500).json({ error: 'Update memo error' });
    }
  });

router.delete('/:id' , async (req , res) => {
    try {
        const memo = await Memo.findByIdAndDelete(req.params.id);
        res.status(200).json(memo);
    } catch (error) {
        console.log("Get memo error" , error);
        res.status(500).json({ error : 'Get memo error'});
    }
})

module.exports = router